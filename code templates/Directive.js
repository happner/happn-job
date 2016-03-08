module.exports = {
    test:function(callback){
        var _this = this;
        //this is where you would mock dependancies required in the operate function

        //mock require
        require = function(moduleName){

            if (moduleName == "fs"){
                //mock the fs modules methods you are going to need
            }
            if (moduleName == "path"){
                //mock the path modules methods you are going to need
            }

            return null;
        }

        //mock an input payload
        var inputPayload = {"test":"payload"}

        //mock a test job
        var testJob = {
            id:"fb2ef697-759c-43b2-868a-dbd17952e3cf", //unique job id
            payload:{type:"stream", file:"fb2ef697-759c-43b2-868a-dbd17952e3cg.dat"}, //the data being passed from the previous directives operate method - can be of type stream/binary/object/string/number
            history:[
                {timestamp:1457435120028, step:{id:"fb2ef697-759c-43b2-868a-dbd17952e3cg"}, message:"step 1 ran"},
                {timestamp:1457435120029, step:{id:"fb2ef697-759c-43b2-868a-dbd17952e3ch"}, message:"step 2 ran"},
                {timestamp:1457435120030, step:{id:"fb2ef697-759c-43b2-868a-dbd17952e3ci"}, message:"step 3 ran"},
            ]
        }

        //we then call the initialize and operate functions to test our code works
        this.initialize(function(e, manipulator){
            if (e) return callback(e);
            _this.operate(inputPayload, manipulator, callback).bind({job:testJob});
        })
    },
    initialize:function(callback){
        //the initialize function sets up the manipulator toolset
        //this is the instrument that performs the work in the operate function
        //NBNB!! - this is where any require code goes, leaving require code
        //out of the operate function makes mocking easily separated
        var manipulator = {};

        //you can add a custom tool to the manipulator
        manipulator.custom = {
            doSomethingInteresting:function(withThis){
                return withThis + ' is now special'
            }
        }

        //attach the node modules you need like so
        // manipulator.fs = require('fs');

        callback(null, manipulator);
    },
    operate:function(input, manipulator, output){

        var currentJobId = this.job.id;
        var newPayLoad = manipulator.custom.doSomethingInteresting(input);

        //the operate function is bound to a deepcopy the job it is busy with, thus it can be accidentally overwritten
        //and still not cause any problems with operations downstream, ie this.job = undefined;

        // {
        //     id:"fb2ef697-759c-43b2-868a-dbd17952e3cf", //unique job id
        //     payload:{type:"stream", file:"fb2ef697-759c-43b2-868a-dbd17952e3cg.dat"}, //the data being passed from the previous directives operate method - can be of type stream/binary/object/string/number
        //     history:[
        //         {timestamp:1457435120028, step:{id:"fb2ef697-759c-43b2-868a-dbd17952e3cg"}, message:"step 1 ran"},
        //         {timestamp:1457435120029, step:{id:"fb2ef697-759c-43b2-868a-dbd17952e3ch"}, message:"step 2 ran"},
        //         {timestamp:1457435120030, step:{id:"fb2ef697-759c-43b2-868a-dbd17952e3ci"}, message:"step 3 ran"},
        //     ]
        // }


        // the manipulator is the toolset available for the operation
        // manipulators will have standard toolheads:
        // manipulator.data.get/set/on
        // manipulator.stream
        // manipulator.fs
        // manipulator.util


        // when the operation is complete, we write the payload to the job:
        ouput(null, newPayLoad);

    }
}