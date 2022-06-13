const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@studentmanagement.qkja8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log("Db Connect");
        const database = client.db("doctors_app_portal");
        const appointmentsCollection = database.collection("appointments");
        const doctorsCollection = database.collection("doctors");

        //GET Api for Appointment
        app.get("/appointments", async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString()
            const cursor = appointmentsCollection.find({ email: email, date: date });
            const allAppointments = await cursor.toArray();
            //console.log(allAppointments)
            res.json(allAppointments)
        })

        //POST Api for Appointment
        app.post("/appointments", async (req, res) => {
            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            res.json(result)
        });
        //Delete Api for Appointment
        app.delete("/appointments/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await appointmentsCollection.deleteOne(query);
            res.json(result)

        })

        //POST Api for Doctor
        app.post("/doctors", async (req, res) => {
            const doctor = req.body;
            //console.log(doctor);
            const result = await doctorsCollection.insertOne(doctor);
            //console.log(result)
            res.json(result)
        })

        //GET Api for Doctor
        app.get("/doctors", async (req, res) => {
            const cursor = doctorsCollection.find({})
            const doctors = await cursor.toArray();
            res.send(doctors)

        })


        //Delete Api for DOCTOR

        app.delete("/doctors/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await doctorsCollection.deleteOne(query);
            //console.log(result)
            res.json(result)
        })

        //update doctors data

        app.get("/doctors/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await doctorsCollection.findOne(query);
            res.json(result)

        })

        app.put("/doctors/:id", async (req, res) => {
            const id = req.params.id;
            const updateDoctor = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    Doctor_Id: updateDoctor.Doctor_Id,
                    Doctor_name: updateDoctor.Doctor_name,
                    Doctor_email: updateDoctor.Doctor_email,
                    Doctor_phone: updateDoctor.Doctor_phone,
                    Doctor_specialized: updateDoctor.Doctor_specialized,
                    Doctor_image: updateDoctor.Doctor_image,
                }
            };
            const result = await doctorsCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })




    } finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Doctors Portal App')
})

app.listen(port, () => {
    console.log(`Doctors Portal app listening on port ${port}`)
})