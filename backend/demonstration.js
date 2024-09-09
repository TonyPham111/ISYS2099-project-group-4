import { poolAdmin } from "./Models/dbConnectionConfiguration.js";
import doctorRepo from "./Models/DoctorModel.js";
import frontDeskRepo from "./Models/FrontDeskModel.js";

//Test For Prescription Concurrency
async function testPrescriptionConcurrency(){
    console.log("Prescribing....")
    prescribing_doctor_1() // Doctor 1 prescribing
    prescribing_doctor_2() // Doctor 2 prescribing

}

async function prescribing_doctor_1(){
    const pre_prescription_inventory = await poolAdmin.query(
        "SELECT inventory FROM Drugs WHERE drug_code = 1", []
    ) //Check inventory before prescription
    console.log("Inventory of Drug 1 before prescription: " + JSON.stringify(pre_prescription_inventory[0]))
    await doctorRepo.AddNewPrescription(102,1,222, "Hello", '2:3,1:2,3:3')
    const post_prescription_inventory = await poolAdmin.query(
        "SELECT inventory FROM Drugs WHERE drug_code = 1", []
    ) // Check inventory after prescription
    console.log("Inventory of Drug 1 after prescription: " + JSON.stringify(post_prescription_inventory[0]))
    
    
}

async function prescribing_doctor_2(){
    const pre_prescription_inventory = await poolAdmin.query(
        "SELECT inventory FROM Drugs WHERE drug_code = 1", []
    ) //Check inventory before prescription
    console.log("Inventory of Drug 1 before prescription: " + JSON.stringify(pre_prescription_inventory[0]))
    await doctorRepo.AddNewPrescription(102,1,222, "Hello", '1:3,3:2,3:3')
    const post_prescription_inventory = await poolAdmin.query(
        "SELECT inventory FROM Drugs WHERE drug_code = 1", []
    ) // Check inventory after prescription
    console.log("Inventory of Drug 1 after prescription: " + JSON.stringify(post_prescription_inventory[0]))
    
    
}

//testPrescriptionConcurrency()

//Test for Appointment Booking Concurrency

async function testAppoinmentBookingConcurrency(){
    console.log("Prescribing....")
    appointmentReservation_frontdesk1() // Doctor 1 prescribing
    appointmentReservation_frontdesk2() // Doctor 2 prescribing

}

async function appointmentReservation_frontdesk1(){
    const availability = await frontDeskRepo.CheckAvailability("2024-09-16", "16:00:00", "16:30:00", 2)
    console.log("Availability of doctors in department 2: "+ JSON.stringify(availability[0]))
    await frontDeskRepo.AddNewAppointment(2, 103, 1, "Routine Checkup", "2024-09-16", "16:00:00", "16:30:00", null)
    console.log("Successfully reserve the appointment: Front Desk 1")

}

async function appointmentReservation_frontdesk2(){
    const availability = await frontDeskRepo.CheckAvailability("2024-09-16", "16:00:00", "16:30:00", 2)
    console.log("Availability of doctors in department 2: "+ JSON.stringify(availability[0]))
    await frontDeskRepo.AddNewAppointment(2, 103, 2, "Routine Checkup", "2024-09-16", "16:00:00", "16:30:00", null)
    console.log("Successfully reserve the appointment: Front Desk 2")

}

//testAppoinmentBookingConcurrency();

// Test Concurrency and Schedulling
async function testAppointmentSchedulingConcurrency(){
    const existing_schedule = await poolAdmin.query(
        "SELECT * FROM Staff_Schedule WHERE staff_id = ? AND schedule_date = ?", [103, '2024-09-18']
    );
    console.log("Existing Schedule: " + JSON.stringify(existing_schedule[0]));
    appointmentReserving_frontdesk1() // Doctor 1 prescribing
    scheduling() // Doctor 2 prescribing

}

async function appointmentReserving_frontdesk1(){
    console.log("Reserving")
    const availability = await frontDeskRepo.CheckAvailability("2024-09-18", "10:30:00", "11:00:00", 2)
    console.log("Availability of doctors in department 2: "+ JSON.stringify(availability[0]))
    await frontDeskRepo.AddNewAppointment(2, 103, 1, "Routine Checkup", "2024-09-18", "10:30:00", "11:00:00", null)
    console.log("Successfully reserve the appointment: Front Desk 1")

}

async function scheduling(){
    console.log("Rescheduling for doctor 103")
    await doctorRepo.Scheduling(102, 103, '2024-09-18;12:30:00-17:00:00')
    console.log("Successfully reschedule for doctor 103")

}

testAppointmentSchedulingConcurrency();