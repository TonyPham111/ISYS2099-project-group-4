import doctorRepo from "../Models/DoctorModel.js";
import nurseRepo from "../Models/NurseModel.js";
import frontDeskRepo from "../Models/FrontDeskModel.js";
import businessOfficerRepo from "../Models/BusinessOfficerModel.js";
import hrRepo from "../Models/HrModel.js";
import mongoose from "mongoose";
import { response } from "express";
import path from "path";
import fs from "fs";
import {createNewQualificationDocument, fetchQualifications, createNewTrainingMaterial, fetchTrainingDocuments} from '../MongodbRepo/Methods.js'

export async function getAllStaffInfo(req, res) {
  try {
    const user_info = req.user
    if (user_info.role === "Doctor"){
      const result = await doctorRepo.GetSubordinates(user_info.id, req.query.staffName, req.query.staffId )
      res.status(200).json(result)
    }
    else if (user_info.role === "Nurse"){
      const result = await nurseRepo.GetSubordinates(user_info.id, req.query.staffName, req.query.staffId)
      res.status(200).json(result)
    }
    else if (user_info.role === "FrontDesk"){
      const result = await frontDeskRepo.GetSubordinates(user_info.id, req.query.staffName, req.query.staffId)
      res.status(200).json(result)
    }
    else if (user_info.role === "BusinessOfficer"){
      const result = await businessOfficerRepo.GetSubordinates(user_info.id, req.query.staffName, req.query.staffId )
      res.status(200).json(result)
    }
    else if (user_info.role === "HR") {
      console.log(req.query.orderBy);
      console.log(req.query.sortBy);
      const result = await hrRepo.FetchAllStaff(req.query.staffId,req.query.staffName, req.query.jobId, req.query.departmentId, req.query.employmentStatus,
        req.query.sortBy, req.query.orderBy)
      res.status(200).json(result[0])
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

export async function addNewStaff(req, res) {
  try {
    const user_info = req.user;
    const {
      full_name, manager_id, department_id, job_id, gender,
      birth_date, home_address, contact_phone_number, email, password, wage
    } = req.body;
    
    const qualification_document_id = '';
    
    if (user_info.role === 'HR') {
      await hrRepo.AddNewStaff(
        full_name, job_id, department_id, manager_id, gender, birth_date,
        home_address, contact_phone_number, email, password, wage, qualification_document_id
      );
      return res.status(200).json({ message: "Staff added successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getSubordinates(req, res) {
  try {
    const user_info = req.user;
    let result;

    if (user_info.role === "Doctor") {
      result = await doctorRepo.GetSubordinates(user_info.id);
    } else if (user_info.role === "Nurse") {
      result = await nurseRepo.GetSubordinates(user_info.id);
    } else if (user_info.role === "FrontDesk") {
      result = await frontDeskRepo.GetSubordinates(user_info.id);
    } else if (user_info.role === "BusinessOfficer") {
      result = await businessOfficerRepo.GetSubordinates(user_info.id);
    } else if (user_info.role === "HR") {
      result = await hrRepo.GetSubordinates(user_info.id);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getStaffPersonalInfo(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    let result;

    if (user_info.role === "Doctor") {
      result = await doctorRepo.FetchStaffInfoById(staff_id);
    } else if (user_info.role === "Nurse") {
      result = await nurseRepo.FetchStaffInfoById(staff_id);
    } else if (user_info.role === "FrontDesk") {
      result = await frontDeskRepo.FetchStaffInfoById(staff_id);
    } else if (user_info.role === "BusinessOfficer") {
      result = await businessOfficerRepo.FetchStaffInfoById(staff_id);
    } else if (user_info.role === "HR") {
      result = await hrRepo.FetchStaffInfoById(staff_id);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function updateStaffPersonalInfo(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    const {
      home_address, phone_number, email, password
    } = req.body;

    if (user_info.role === 'HR') {
      await hrRepo.ChangeStaffPersonalInfo(staff_id, phone_number, email, password, home_address);
      return res.status(200).json({ message: "Personal info updated successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function updateStaffWage(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    const { new_wage } = req.body;

    if (user_info.role === 'HR') {
      await hrRepo.ChangeWage(staff_id, new_wage);
      return res.status(200).json({ message: "Wage updated successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getWageChangeHistory(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;

    if (user_info.role === 'HR') {
      const result = await hrRepo.FetchWageChangeByStaffId(staff_id);
      return res.status(200).json(result[0]);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function updateStaffJob(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    const { new_job, new_wage, new_manager_id, new_department_id } = req.body;

    if (user_info.role === 'HR') {
      await hrRepo.ChangeJob(staff_id, new_job, new_wage, new_manager_id, new_department_id);
      return res.status(200).json({ message: "Job updated successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getJobChangeHistory(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;

    if (user_info.role === 'HR') {
      const result = await hrRepo.FetchJobChangeByStaffId(staff_id, req.query.from, req.query.to);
      return res.status(200).json(result[0]);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function updateStaffDepartment(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    const { new_manager_id, new_department_id } = req.body;

    if (user_info.role === 'HR') {
      await hrRepo.ChangeDepartment(staff_id, new_manager_id, new_department_id);
      return res.status(200).json({ message: "Department updated successfully." });
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getDepartmentChangeHistory(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;

    if (user_info.role === 'HR') {
      const result = await hrRepo.FetchDepartmentChangeByStaffId(staff_id, req.query.from, req.query.to);
      console.log(result)
      return res.status(200).json(result[0]);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function evaluateStaff(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    const evaluations = req.body;
    console.log(evaluations)
    let criteria_string = '';
    for (let i = 0; i < evaluations.length; i++){
      const {
        criteria_id,
        criteria_score
      } = evaluations[i];
      criteria_string = criteria_string + `${criteria_id}:${criteria_score}`
      if (i < evaluations.length - 1){
        criteria_string = criteria_string + ','
      }
    }
    if (user_info.role === 'Doctor') {
      await doctorRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string);
    } else if (user_info.role === 'Nurse') {
      await nurseRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string);
    } else if (user_info.role === 'FrontDesk') {
      await frontDeskRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string);
    } else if (user_info.role === 'HR') {
      await hrRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string);
    } else if (user_info.role === 'BusinessOfficer') {
      await businessOfficerRepo.CreateNewEvaluation(user_info.id, staff_id, criteria_string);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json({ message: "Evaluation submitted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getStaffEvaluations(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    let result;

    if (user_info.role === 'Doctor') {
      result = await doctorRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'FrontDesk') {
      result = await frontDeskRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'HR') {
      result = await hrRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'BusinessOfficer') {
      result = await businessOfficerRepo.GetAllPerformanceEvaluation(user_info.id, staff_id, req.query.from, req.query.to);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function GetEvaluationDetails(req, res) {
  try {
    const user_info = req.user;
    const evaluation_id = req.params.evaluationId;
    let result;

    if (user_info.role === 'Doctor') {
      result = await doctorRepo.GetEvaluationDetails(user_info.id, evaluation_id);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.GetEvaluationDetails(user_info.id, evaluation_id);
    } else if (user_info.role === 'FrontDesk') {
      result = await frontDeskRepo.GetEvaluationDetails(user_info.id, evaluation_id);
    } else if (user_info.role === 'HR') {
      result = await hrRepo.GetEvaluationDetails(user_info.id, evaluation_id);
    } else if (user_info.role === 'BusinessOfficer') {
      result = await businessOfficerRepo.GetEvaluationDetails(user_info.id, evaluation_id);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function schedule(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    const schedule_list = req.body;
    let schedule_string = ''
    for (let i = 0; i < schedule_list.length; i++){
      const {
        schedule_date,
        start_time,
        end_time
      } = schedule_list[i]
      schedule_string = schedule_string+`${schedule_date};${start_time}-${end_time}`
      if (i < schedule_list.length - 1){
        schedule_string = schedule_string + ','
      }
    }
    if (user_info.role === 'Doctor') {
      await doctorRepo.Scheduling(user_info.id, staff_id, schedule_string);
    } else if (user_info.role === 'Nurse') {
      await nurseRepo.Scheduling(user_info.id, staff_id, schedule_string);
    } else if (user_info.role === 'FrontDesk') {
      await frontDeskRepo.Scheduling(user_info.id, staff_id, schedule_string);
    } else if (user_info.role === 'HR') {
      await hrRepo.Schedule(user_info.id, staff_id, schedule_date, schedule_string);
    } else if (user_info.role === 'BusinessOfficer') {
      await businessOfficerRepo.Schedule(user_info.id, staff_id, schedule_string);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json({ message: "Schedule updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteSchedule(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    const { schedule_ids } = req.body;

    const schedule_string = schedule_ids.join(",");

    if (user_info.role === 'Doctor') {
      await doctorRepo.DeleteSchedule(user_info.id, staff_id, schedule_string);
    } else if (user_info.role === 'Nurse') {
      await nurseRepo.DeleteSchedule(user_info.id, staff_id, schedule_string);
    } else if (user_info.role === 'FrontDesk') {
      await frontDeskRepo.DeleteSchedule(user_info.id, staff_id, schedule_string);
    } else if (user_info.role === 'HR') {
      await hrRepo.DeleteSchedule(user_info.id, staff_id, schedule_string);
    } else if (user_info.role === 'BusinessOfficer') {
      await businessOfficerRepo.DeleteSchedule(user_info.id, staff_id, schedule_string);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }

    return res.status(200).json({ message: "Schedule removed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getStaffSchedule(req, res) {
  try {
    const user_info = req.user;
    const staff_id = req.params.staffId;
    let result;

    if (user_info.role === 'Doctor') {
      result = await doctorRepo.GetSubordinatesSchedule(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'Nurse') {
      result = await nurseRepo.GetSubordinatesSchedule(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'FrontDesk') {
      result = await frontDeskRepo.GetSubordinatesSchedule(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'HR') {
      result = await hrRepo.GetSubordinatesSchedule(user_info.id, staff_id, req.query.from, req.query.to);
    } else if (user_info.role === 'BusinessOfficer') {
      result = await businessOfficerRepo.GetSubordinatesSchedule(user_info.id, staff_id, req.query.from, req.query.to);
    } else {
      return res.status(403).json({ message: "Incorrect role." });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}



export async function getTrainingMaterials(req, res) {
  try {
    const user_info = req.user
    const department_id = user_info.department_id
    const job_id = user_info.job_id
    res.send(await fetchTrainingDocuments(job_id, department_id))
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function NewTrainingMaterial(req, res) {
     try {
       const user_info = req.user
       const {
           job_id,
           department_id,  
       } = req.body
       const training_material = {
          file_name: req.file.originalname,
          file: req.file.buffer,
       }
       const document = {
          department_id: department_id,
          job_id: job_id,
          training_material: training_material
       }
       if (user_info.role === 'HR'){
        await createNewTrainingMaterial(document);
        res.status(200).json({message: "Training Document Added"})
       }
       else {
         res.status(403).json({message: error.message})
       }
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
  }

export async function addNewQualifications(req, res) {
    const transaction = await mongoose.startSession()
    try {
      transaction.startTransaction()
      const user_info = req.user
      const qualifications = req.body
      if (user_info.role === 'HR'){
          for (let i = 0; i < qualifications.length; i++){
            if (qualifications[i].certificate) {
              console.log(true)
              qualifications[i].certificate.file = Buffer.from(qualifications[i].certificate.file, 'base64')
            }
            else if (qualifications[i].letter_of_reference){
              qualifications[i].letter_of_reference.file = Buffer.from(qualifications[i].letter_of_reference.file, 'base64')
            }
            else {
              qualifications[i].document.file = Buffer.from(qualifications[i].document.file, 'base64')
            }
          }
          const results = await createNewQualificationDocument(qualifications);
          console.log(results);
          let qualifications_string = '';
          for (let i = 0; i < results.length; i++){
              qualifications_string = qualifications_string + results[i]._id.toString() + ':' + results[i].type
              if (i < results.length - 1){
                qualifications_string = qualifications_string + ","
              } 
          }
          await hrRepo.AddNewQualifications(req.params.staffId, qualifications_string);
          await transaction.commitTransaction()
          res.status(200).json({message: 'Qualifications added sucessfully'})

      }
      else {
        res.status(403).json({message: error.message})
      }
    } catch (error) {
      await transaction.abortTransaction()
      res.status(500).json({ message: error.message });
    } finally{
        transaction.endSession()
    }
 }


export async function getStaffQualifications(req, res) {
  try {
    const user_info = req.user
    const staff_id = req.params.staffId
    let response;

    if (user_info.role === "Doctor"){
      response = await doctorRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "Nurse"){
      response = await nurseRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "FrontDesk"){
      response = await frontDeskRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "BusinessOfficer"){
      response = await businessOfficerRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else if (user_info.role === "HR") {
      response = await hrRepo.FetchStaffQualifications(user_info.id, staff_id)
    }
    else {
      res.status(403).json({ message: "Incorrect role." })
    }
    const results = await fetchQualifications(response[0])
    res.status(200).json(results)
    
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



