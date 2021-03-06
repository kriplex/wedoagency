import React, {Component} from 'react'
import {loadPortfolio} from '../../ducks/portfolio';
import {connect} from 'react-redux';
import Loader from '../Loader';
import ErrorCmp from '../ErrorCmp';
import { Grid, Row, Col } from 'react-bootstrap';
import PortfolioListItem from './PortfolioListItem';

class PortfolioList extends Component{

	componentDidMount(){
		const { useLang, loadPortfolio } = this.props

		if (this.props.entities.toArray().length < 9){
			loadPortfolio(useLang)
		}

		
	}

	componentWillReceiveProps(nextProps){
		if(this.props.useLang != nextProps.useLang){
			this.props.loadPortfolio(nextProps.useLang);
		}
	}

	sortBody = (a, b) => {
		const aDate = a.props.children[0].props.item.acf.DataOfFinnish
		const bDate = b.props.children[0].props.item.acf.DataOfFinnish

	  var aNumberForCompare = aDate.split('/').reverse().join()
  	var bNumberForCompare = bDate.split('/').reverse().join()	
        		
  	return aNumberForCompare > bNumberForCompare ? -1 : (aNumberForCompare < bNumberForCompare ? 1 : 0);	
	}

	render(){
		const { useLang, entities, loading, error, count, match, portfolioList} = this.props;

		if (loading) return <Loader />;
		if (error) return (<ErrorCmp error={error} />);	

		const projectsItems = entities.toArray();

		const body = projectsItems.map( item => <li key={item.id}>
																 							<PortfolioListItem item={item} match={match}/>
																 							<div className="portfolioItem__mobile-padding" />
															 							</li>).sort(this.sortBody)
		
		if( body.length === 0 ){
			return <div>Данные недоступны</div>
		}
		
		const showMore = useLang == "ru" ? "Показать еще" : "Show more";
		const projects = useLang == "ru" ? "Портфолио" : "Portfolio";
		const toggleShowMore = body.length != count ? <div className='showMore'>
																									  <span onClick={this.addingPress}>
																									    {showMore}
																									  </span>
																									</div>
																								: null;

		const header = {
			backgroundImage: `-webkit-image-set( url(${portfolioList.acf.foto}) 1x, url(${portfolioList.acf.fotox2}) 2x )`,
			backgroundImage: `-moz-image-set( url(${portfolioList.acf.foto}) 1x, url(${portfolioList.acf.fotox2}) 2x )`,
			backgroundImage: `-o-image-set( url(${portfolioList.acf.foto}) 1x, url(${portfolioList.acf.fotox2}) 2x )`,
			backgroundImage: `-ms-image-set( url(${portfolioList.acf.foto}) 1x, url(${portfolioList.acf.fotox2}) 2x )`,
			backgroundImage: `url(${portfolioList.acf.foto})`,
			marginBottom: '100px'
		} || null;
					
		return (
			<div className='portfolioList'>
				<div className="articleImgNews" style={header} />
				<Grid >
					<Row className="no-gutters">
						<Col md={12}>
							<h1>{projects}</h1>
						</Col>
					</Row>
					<Row className="no-gutters">
						<div className="col-12">
							<ul className="portfolio__containerItems">
								{body}
							</ul>
							<div className='clear' />
							{toggleShowMore}
						</div>
					</Row>		
				</Grid>
			</div>	
		)
	}

	addingPress = () => {
		const { useLang } = this.props;
		this.props.loadPortfolio(useLang);
	}
}

const mapStateToProps = state => {
	return {
		useLang: state.lang.useLang,
		entities: state.portfolio.entities,
		portfolioList: state.portfolio.portfolioList,
		count: state.portfolio.count,
		loading: state.portfolio.loading,
		error: state.portfolio.error
	}
}

export default connect(mapStateToProps, {loadPortfolio})(PortfolioList);