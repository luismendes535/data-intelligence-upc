
let Dashboard  = require('../src/Dashboard');

exports.loadDashboard = (req, res)=>res.render("dashboards/home", {data: new Dashboard(req.params)});

exports.getChartData = (req, res)=> {
	let dashboard = new Dashboard(req.params);
	dashboard.setAggregation(req.query.agg);
	dashboard.setFormula(req.query.formula);
	dashboard.setDimension(req.query.dimension);
	return dashboard.getChartData().then((result)=>res.json(result));
}

