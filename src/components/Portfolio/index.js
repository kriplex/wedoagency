import React, {Component} from 'react';
import {connect} from 'react-redux';
import {loadPortfolio} from '../../ducks/portfolio.js';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image } from 'pure-react-carousel';
import PortfolioItem from './PortfolioItem';
import Loader from '../Loader';
import ErrorCmp from '../ErrorCmp';
import {PATH} from '../../config'

class Portfolio extends Component{

	componentDidMount(){
    const useLang = this.props.useLang;
		this.props.loadPortfolio(useLang);
	}

	componentWillReceiveProps(nextProps){
		if(this.props.useLang != nextProps.useLang){
			this.props.loadPortfolio(nextProps.useLang)
    }
	}

	sortBody = (a, b) => {
		const aDate = a.props.children.props.item.acf.DataOfFinnish
		const bDate = b.props.children.props.item.acf.DataOfFinnish

		var aNumberForCompare = aDate.split('/').reverse().join()
    var bNumberForCompare = bDate.split('/').reverse().join()	
        		
    return aNumberForCompare > bNumberForCompare ? -1 : (aNumberForCompare < bNumberForCompare ? 1 : 0);	
	}

	render(){

		const {useLang, entities, error, loading, catName, match} = this.props;

		if (loading) return <Loader />;
		if (error) return (<ErrorCmp error={error} />);			

		const portfolioSlider = entities.toArray();

		if (portfolioSlider.length == 0){
			return <div>Данные временно не доступны</div>
		}		

		const checkId = this.props.match.params.id ? this.props.match.params.id : null;
		
		const filtredBody = portfolioSlider.filter(item => item.id != this.props.match.params.id);

		const body = filtredBody.map( (item) => <Slide key={item.id} index={item.id}>
        																					<PortfolioItem item={item} match={match}/>
																		      			</Slide>
     																					).sort(this.sortBody)

		const opacity = body.length > 3 ? {opacity: "1"} : {opacity: "0.3"}

		const title = this.selectTitle()

		return (
			<div className='portfolio'>
		  	<CarouselProvider naturalSlideWidth={327} naturalSlideHeight={411} totalSlides={body.length} visibleSlides={3}>
			    <div className='container'>
			 	    <div className='row no-gutters'>
					    <div className="col-sm-8">
					      <h1 className='portfolio__title'>{title}</h1>
					    </div>
					    <div className="col-md-4 col-sm-6 SliderButtons">
						    <ButtonNext>
						    	<img src={`${PATH}/img/slider/next.svg`} style={opacity}/>
						    </ButtonNext>
						    <ButtonBack>
						    	<img src={`${PATH}/img/slider/next.svg`} className="sliderButtonsOpacityRevert" style={opacity}/>
						    </ButtonBack>
						    <div className="clear"/>
        	    </div>
				    </div>
				     <div className='row no-gutters portfolioSlider'>
        	    <div className="col-md-12 hidePixelsWrapper">
						    <Slider>
                  {body}
        		    </Slider>
        		    <div className="hidePixels" />
        	    </div>
            </div>				
				  </div>	
				</CarouselProvider>
			</div>	
		)	
	}

	selectTitle = () => {
		const {useLang, match} = this.props

		if (useLang != 'ru'){
			return match.path == '/' ? "Portfolio" : "All projects" 
		}
		
		return match.path == '/' ? 'Портфолио' : "Все проекты"
		
	}
}

const mapStateToProps = state => {
	return {
		useLang: state.lang.useLang,
		entities: state.portfolio.entities,
    catName: state.portfolio.catName,
		loading: state.portfolio.loading,
		error: state.portfolio.error
	}
}

export default connect(mapStateToProps, {loadPortfolio})(Portfolio)