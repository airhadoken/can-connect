var QUnit = require("steal-qunit");
var canSet = require("can/util/util");
var fixture = require("can/util/fixture/fixture");
var persist = require("can-connect/data-url");

QUnit.module("can-connect/persist",{
	setup: function(){
		fixture.delay = 1;
	}
});

QUnit.test("basics", function(assert){
	
	var connection = persist({
		url: {
			getListData: "POST /getList",
			getData: "DELETE /getInstance",
			createData: "GET /create",
			updateData: "GET /update/{id}",
			destroyData: "GET /delete/{id}"
		}
	});
	
	fixture({
		"POST /getList": function(){
			return [{id: 1}];
		},
		"DELETE /getInstance": function(){
			return {id: 2};
		},
		"GET /create": function(){
			return {id: 3};
		},
		"GET /update/{id}": function(request){
			equal(request.data.id, 3, "update id");
			return {update: true};
		},
		"GET /delete/{id}": function(request){
			equal(request.data.id, 3, "update id");
			return {destroy: true};
		}
	});
	
	stop();
	connection.getListData({foo: "bar"}).then(function(items){
		deepEqual(items, [{id: 1}], "getList");
		start();
	});
	
	stop();
	connection.getData({foo: "bar"}).then(function(data){
		deepEqual(data, {id: 2}, "getInstance");
		start();
	});
	
	stop();
	connection.createData({foo: "bar"}).then(function(data){
		deepEqual(data, {id: 3}, "create");
		start();
	});
	
	stop();
	connection.destroyData({foo: "bar", id: 3}).then(function(data){
		deepEqual(data, {destroy: true}, "update");
		start();
	});
	
});
