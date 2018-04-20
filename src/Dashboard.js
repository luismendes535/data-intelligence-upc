const TinyOlap = require('tiny-olap');
const _ = require('lodash');
const mLab = require('mongolab-data-api')('LopVP0VmN3hlc_p4Q0RtWPuQq346lEhn');

function Dashboard (parameters) {
	// Init
	this.no_collection_selected = true;
	this.getCollections().then((result)=>this.collections = result); //Needs to be fixed
	
	//console.log(this.collections);
	// Check collections
	if (parameters.hasOwnProperty('collection')) {
		this.selected_dataset = parameters.collection
	} else {
		// Future work: implement a default dataset
		this.selected_dataset = "";
	}
	// Get the dataset
	try {
		this.dataset = require('../models/'+this.selected_dataset);
		this.no_collection_selected = false;	
	}catch(exception) {
		this.collection_not_found = true;
	}
	if (this.hasOwnProperty('dataset')) {
		let options = {
			database:'dataintelligenceuminho',
			collectionName: this.selected_dataset,
			query: '{}'
		};
	
		mLab.listDocuments(options, (err, data)=> this.keys = Object.keys(data[0]));	
	}
}

Dashboard.prototype.getCollections = function () {
	return new Promise((resolve)=>{
	let _collections;
	mLab.listCollections('dataintelligenceuminho', function(err, collections) {
		 _collections = collections;
	});
	//console.log(_collections);
	resolve(_collections);
});
}

Dashboard.prototype.setDimension = function(dimension){
	this.dimension = dimension;
}
Dashboard.prototype.setFormula = function(formula) {
	this.formula = formula;
}
Dashboard.prototype.setAggregation = function(aggregation) {
	this.aggregation = aggregation;
}
Dashboard.prototype.getChartData = function() {
	return new Promise ((resolve)=>{
	let _result = {};
	if (this.hasOwnProperty('dataset')) {
		let promise = this.dataset.find({}).then(dataset => {
			let olap = new TinyOlap(dataset); //OLAP creation 
			let result = olap
				.query()
				.group(this.dimension)
				.measure({
					name: this.formula,
					formula: this.formula,
					agg: this.aggregation
				}).run();
			let keys = _.keys(result[0]); // keys of the result
			let resultSize = _.keys(result[0]).length; 
			let key1=[];
			let key2=[];
			let data=[];
			for(let i =0; i < result.length; i++){
				data.push(result[i][keys[resultSize-1]]);
				key1.push(result[i][keys[0]]);
				if(resultSize===3){ //More than 1 dimension
					key2.push(result[i][keys[1]]);
				}
			}
			_result.data = data;
			_result.key1 = key1;
			_result.key2 = key2;
			_result.formula = this.formula; 
			resolve(_result);
			})
		}
	});
}

module.exports = Dashboard;