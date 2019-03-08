import React, { Component } from 'react';
import TableList from './tablelist.js'
import update from 'immutability-helper'
import { AppInsights } from 'applicationinsights-js';

// Imports components from Fluent Web https://fluentweb.com/building-blocks 
//import { Header, ContentPlacement, TypographicIntro, Footer, Hyperlink, Table } from '@ms-fw/fw-react/components';

// Imports layout features from Fluent Web https://fluentweb.com/prototyping/getting-started/grid-layout 
//import { Page, Grid, Column } from '@ms-fw/fw-react/layouts';

//import { FabricSlider, Select, Label, Checkbox, CallToAction, Divider, Button, NumberField, Heading, Alert } from '@ms-fw/fw-react/components';
//import { Slider } from 'office-ui-fabric-react/lib/Slider';
//import { TextField } from 'office-ui-fabric-react/lib/TextField';



export default class BattleRoyal extends Component {

  state = { orderedSets: {}, server: {}, messages: ""}

  _wsSendJoin(keepalive) {
    this.ws.send(JSON.stringify({type: "JOIN", time: new Date().getTime(), name: this.input.value}));
  }

  _wsMessageEvent(event) {
    console.log(`dispatching message from server ${event.data}`);
    var msg = JSON.parse(event.data)
    if (msg.type === 'JOINED' && msg.interval && !this.wsping) {
      this.wsping = setInterval (this._wsSendJoin.bind(this, true), msg.interval * 1000)
    } 
    this._updateState(msg)
  }

  _wsCloseEvent(event) {
    console.log ('close')
    clearInterval(this.wsping); this.wsping = null
    this._updateState({type: 'LEFT'})
    this.ws.removeEventListener('open', this._wsSendJoin.bind(this));
    this.ws.removeEventListener('message', this._wsMessageEvent.bind(this));
    this.ws.removeEventListener('close', this._wsCloseEvent.bind(this));
    this.ws = null;
  }

  _toggleListen() {
    if (!this.ws) {
      fetch(process.env.REACT_APP_GET_WS_SERVER, {crossDomain:true}).then((r) => {
          console.log (r.status)
          if (r.status !== 200) {
            this.setState({dowork_last: `errcode:${r.status}`})
          } else {
            return r.json();
          }
          }, err => this.setState({dowork_last: err})).then(rjson => {
            
            this.ws = new WebSocket(`ws://${rjson.endpoint}/path`);
            this.ws.addEventListener('open', this._wsSendJoin.bind(this, false));
            this.ws.addEventListener('message', this._wsMessageEvent.bind(this));
            this.ws.addEventListener('close', this._wsCloseEvent.bind(this));
          })
      } else {
        this.ws.close()
      }
  }

  _updateState(msg) {
    let ret = {}
    switch (msg.type) {
      case 'LEFT': 
        ret =  { orderedSets: {}, server: {},  messages: ""}
        break
      case 'JOINED':
        //   http://redux.js.org/docs/recipes/UsingObjectSpreadOperator.html
        ret =  {server: {name: msg.name, server: msg.server, interval: msg.interval}}
        break
      case 'UPDATEKEY':
        if (!this.state.orderedSets[msg.key]) { 
          ret =  {orderedSets: { ...this.state.orderedSets,  [msg.key]: [msg]}}
        } else {
          let updt_idx = this.state.orderedSets[msg.key].findIndex((e) => e.id === msg.id);
          if (updt_idx >=0) {
            // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
            ret = {orderedSets: update (this.state.orderedSets, {[msg.key]: {$splice:[[updt_idx, 1, msg]]}})}
          } else {
            ret = {orderedSets: update (this.state.orderedSets, {[msg.key]: {$push:[msg]}})}
          }
        }
        break
      case 'REMOVEKEY':
        if (this.state.orderedSets[msg.key]) { 
          let rm_idx = this.state.orderedSets[msg.key] && this.state.orderedSets[msg.key].findIndex((e) => e.id === msg.id);
          if (rm_idx >=0) {// perform 1 splice, at position existing_idx, remove 1 element
            ret =  {orderedSets: update (this.state.orderedSets, {[msg.key]: {$splice: [[rm_idx, 1]]}})}
          }
        }
        break
      default:
        console.log (`unknown mesg ${msg.key}`)  
    }

    this.setState ({ ...this.state,  ...ret})//, messages: this.state.messages + JSON.stringify(msg) + '\n> '})
  }

  _dowork() {
    let start = Date.now()
    fetch (`//${window.location.hostname}${process.env.REACT_APP_DEV_PORT ? `:${process.env.REACT_APP_DEV_PORT}` : "" }/dowork`, {mode: 'no-cors'}).then((r) => {
      console.log (r.status)
      if (r.status !== 200) {
        this.setState({dowork_last: `errcode:${r.status}`})
      } else {
        this.setState({dowork_last: Date.now() - start})
      }
      }, err => this.setState({dowork_last: err}))
  }
  componentDidMount() {
    AppInsights.trackPageView("battleroyal", "/battleroyal")
    //this._toggleListen()
  }
  componentDidUpdate() {
    //this.socketoutdom.scrollTop = this.socketoutdom.scrollHeight
  }

  render() {
    return (
      
      <div className="container">

        <div className="panel panel-primary">
          <div className="panel-heading">Telemetry Server Connection</div>
          <div className="panel-body btn-margins">
            <div className="form-group">
              <label className="col-md-2">Connection name</label>
              <div className="col-md-4">
                <input type='text' className='form-control'  defaultValue={`${window.navigator.platform}-${window.navigator.product}`}
                  ref={(input) => this.input = input}/>
              </div>
              <div className="col-md-6">   
                <button className="btn btn-lg btn-success" onClick={this._toggleListen.bind(this)}>{!this.state.server.name ? "Connect" : `Disconnect`}</button>  
                <button className="btn btn-lg btn-warning" disabled={!this.state.server.name} onClick={this._toggleListen.bind(this)}>Reset</button>
                <button className="btn btn-lg btn-warning" disabled={!this.state.server.name} onClick={this._dowork.bind(this)}>Do Work ({this.state.dowork_last})</button>
              </div>
            
              { false && 
              <div className="col-md-12">  
                <figure className="highlight" style={{"height": "400px"}}>
                  <pre style={{"height": "90%", "overflowY": "scroll", "margin": 0}} ref={(con) => { this.socketoutdom = con}}>
                    <code className="language-html" >
                        {this.state.messages}
                    </code>
                  </pre>
                </figure>
              </div>
              }
            </div>
          </div>
        </div>

        <div className="panel panel-container">
          <div className="row">
            <div className="col-xs-6 col-md-3 col-lg-3 no-padding">
              <div className="panel panel-teal panel-widget border-right">
                <div className="row no-padding"><em className="fa fa-xl fa-shopping-cart color-blue"></em>
                  <div className="large">120</div>
                  <div className="text-muted">New Orders</div>
                </div>
              </div>
            </div>
            <div className="col-xs-6 col-md-3 col-lg-3 no-padding">
              <div className="panel panel-blue panel-widget border-right">
                <div className="row no-padding"><em className="fa fa-xl fa-comments color-orange"></em>
                  <div className="large">52</div>
                  <div className="text-muted">Comments</div>
                </div>
              </div>
            </div>
            <div className="col-xs-6 col-md-3 col-lg-3 no-padding">
              <div className="panel panel-orange panel-widget border-right">
                <div className="row no-padding"><em className="fa fa-xl fa-users color-teal"></em>
                  <div className="large">24</div>
                  <div className="text-muted">New Users</div>
                </div>
              </div>
            </div>
            <div className="col-xs-6 col-md-3 col-lg-3 no-padding">
              <div className="panel panel-red panel-widget ">
                <div className="row no-padding"><em className="fa fa-xl fa-search color-red"></em>
                  <div className="large">25.2k</div>
                  <div className="text-muted">Page Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">  
            <TableList title="Process Role: FRONTEND" messages={this.state.orderedSets} set_key="kapp_FRONTEND" icon="transfer" columns={[{key:"id",len:1},{lb:"hostname",key:"data.hostname",len:3}, {lb:"processing", key:"data.reqopen",len:1}, {lb:"complete",key:"data.reqcomp",len:1}, {lb: "uptime", key:"data.uptime",len:1}, {lb: "lastreq",key:"data.lastreqtm",len:1}]}/>
          </div>
          <div className="col-md-12">  
            <TableList title="Process Role: WORKER" messages={this.state.orderedSets} set_key="kapp_WORKER" icon="cog" columns={[{key:"id",len:1},{lb:"hostname",key:"data.hostname",len:3}, {lb:"processing", key:"data.reqopen",len:1}, {lb:"complete",key:"data.reqcomp",len:1}, {lb: "uptime", key:"data.uptime",len:1}, {lb: "lastreq",key:"data.lastreqtm",len:1}]}/>
          </div>
          { true && 
          <div className="col-md-12">  
            <TableList title="Connected Telemtry Users" messages={this.state.orderedSets} set_key="kapp_USERS" icon="user" columns={[{key:"id",len:1},{lb: "name", key:"data.name",len:2}, {lb: "server", key:"data.server",len:3}, {lb: "ping", key:"data.ping",len:1}, {lb: "time", key:"data.connected_for",len:1}, {lb: "platform", key:"data.platform",len:3}]}/>
          </div>
          }
        </div>
      </div>
    );
  }
}
