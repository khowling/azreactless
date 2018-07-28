import React, {Component} from 'react'

export default class TableList extends Component {

	constructor (props) {
		super(props);
		this.state = {reference_txt: "", selected: []}
	}
    _selectfn(id) {
		
	}
    _handleChange (e) {
      this.setState({reference_txt: e.target.value})
    }
    _buttonPress() {
		//this.props.buttonfn(this.state.selected, this.state.oref)
		this.setState({selected: [], reference_txt: ""})
	}


    render() {
        let that = this, renderList = this.props.set_key ? this.props.messages[this.props.set_key] : this.props.messages
        return(
        <div className="panel panel-default">
            <div className="panel-heading">
                {this.props.title}
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-1">
                  <div></div>
                </div>
                { that.props.columns.filter((o) => o.key === "data.reqopen").length === 1 &&
                <div className="col-md-3">
                    <b>busy</b>
                </div>
                }
                { that.props.columns && that.props.columns.map (({lb, key, len}) => (
                  <div key={key} className={`col-md-${len}`}>
                    <b>{lb || key}</b>
                  </div>
                ))}
              </div>
              <div className="row">
                <ul className="list-unstyled no-padding">
                    { renderList && renderList.length >0 && renderList.map ((k,i) => {
                        return <TableListItem key={i} item={k} columns={that.props.columns} checked={(this.state.selected.indexOf(k.id)>=0)} icon={that.props.icon}/>
                    })}
                </ul>
              </div>
            </div>
        </div>
        )
    }
}


const TableListItem = ({item, columns, icon}) => (
    <li className="4list-items-row vertical-align">

            <div className="col-md-1">
                <span className={`glyphicon glyphicon-${icon}`} aria-hidden="true" style={{"backgroundColor": "#0078D7"}}></span>
            </div>
            { columns.filter((o) => o.key === "data.reqopen").length === 1 &&
            <div className="col-md-3  no-padding" style={{"marginTop": "16px"}}>
                <div className="progress">
                    <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{"width": `${item.data.reqopen*10}%`}}>
                        <span className="sr-only">60%</span>
                    </div>
                </div>
            </div>
            }
            { columns && columns.map (({key, len}) => { 
                let lu = key.split('.'),
                    calv = (lu.length === 1) ? item[lu[0]] :item[lu[0]][lu[1]]
                return (
                <div key={key} className={`col-md-${len}`}>
                    {calv}
                </div>
            )})}

    </li>
)
