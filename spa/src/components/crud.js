import React, { Component } from 'react';
import { AppInsights } from 'applicationinsights-js'; 

class CRUD extends Component {

  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {people: []}
  }
  
  componentDidMount() {
    AppInsights.trackPageView("crud", "/crud")
    this.get()
  }

  add() {
    AppInsights.trackEvent("Add Item", { text: this.input.current.value }, { line_count: 1 });
    this._fetchit('POST','/api/orders', JSON.stringify({name: this.input.current.value})).then(succ => {
      console.log (`created success : ${JSON.stringify(succ)}`)
      this.input.current.value = ""
      this.get()
    }, err => {
      this.setState({error: `POST ${err}`})
    })
  }

  get() {
    this._fetchit('GET','/api/orders').then(succ => {
      console.log (`got list success : ${JSON.stringify(succ)}`)
      this.setState({ error: null, people: succ});
    }, err => {
      this.setState({error: `GET ${err}`})
    })
  }

  del(p) {
    console.log (`del ${p}`)
    this._fetchit('DELETE',`/api/order/${p}`).then(succ => {
      console.log (`delete success : ${JSON.stringify(succ)}`)
      this.get()
    }, err => {
      this.setState({error: `DELETE ${err}`})
    })
  }


  _fetchit(type, url, body = null) {
    return new Promise((resolve, reject) => {
      let opts = {
        crossDomain:true,
        method: type,
        credentials: 'same-origin'
      }
      if (body) {
        opts.body = body
        opts.headers = {
          'content-type': 'application/json'
        }
      }

      fetch((process.env.REACT_APP_FN_HOST || '') + url + (process.env.REACT_APP_FN_KEY || ''), opts).then((r) => {
        console.log (`fetch status ${r.status}`)
        if (!r.ok) {
          console.log (`non 200 err : ${r.status}`)
          return reject(r.status)
        } else {
          if ((r.status === 200 && type === 'DELETE') || (r.status === 201 && type === 'POST')) {
            return resolve();
          } else {
            r.json().then(rjson => {
              if (rjson) {
                return resolve(rjson)
              } else {
                return reject("no output")
              }
            })
          }          
        }
        }, err => {
          console.log (`err : ${err}`)
          return reject(err)
        })
      })
  }



  render() {
    
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="page-header">People Demo Testing</h1>
            { this.state.error && 
            <div className="alert bg-danger" role="alert">
              <em className="fa fa-lg fa-warning">&nbsp;</em>Backend error : {this.state.error} 
              <a  className="pull-right"><em className="fa fa-lg fa-close"></em></a></div>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="panel panel-primary">

              <div className="panel-heading">
                People List
                
              </div>
              
              <div className="panel-body">
                <ul className="todo-list">

                  { this.state.people.map((p,i) => 

                    <li key={i} className="todo-list-item">
                    <div className="checkbox">
                      
                      <label >{p.name}</label>
                    </div>
                    <div className="pull-right action-buttons"><a onClick={this.del.bind(this,p.id)}  className="trash">
                      <em className="fa fa-trash"></em>
                    </a></div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="panel-footer">
                <div className="input-group">
                  <input type="text" className="form-control input-md" placeholder="First name" ref={this.input}/><span className="input-group-btn">
                    <button className="btn btn-primary btn-md" onClick={this.add.bind(this)} >Add</button>
                </span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default CRUD;