import React, {Component} from 'react'

class PortfolioItem extends Component{
	state = {
	 	show: false
	}

	render(){
		const {item} = this.props;

		const body = <div className="portfolioItem__Info">
									 <div className="portfolioItem__info-data">{item.title.rendered}</div>
								   <div className="news__info-itemdata ">{item.acf.DataOfFinnish}</div>
								 </div>

		return (
			<div className="portfolioItem__wrapper" onMouseEnter={this.handlerMouseEnter} onMouseLeave={this.handlerMouseLeave}>
				<img src={item.acf.StartFoto} srcSet={item.acf.StartFotox2} className="portfolioItem__img"/>
				{this.state.show && body}
			</div>
		)
	}

	handlerMouseEnter = e => {
		this.setState({
			show: true
		})
	}

	handlerMouseLeave = e => {
		this.setState({
			show: false
		})
	}
}

export default PortfolioItem