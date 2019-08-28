import axios from 'axios'

const state = {
  dni: null,
  age: null,
  first_name: null,
  last_name: null,
  birth_date: null,
  gender: null,
  history_number: null,
  contact: null,
  contact2: null,
  income_diagnosis: null,
  patients: null,
}

const mutations = {
  setPatient(state, patient) {
    state.dni = patient['dni']
    state.age = patient['age']
    state.first_name = patient['first_name']
    state.last_name = patient['last_name']
    state.birth_date = patient['birth_date']
    if (patient.gender === 0) {
      state.gender = 'Masculino'
    } else if (patient.gender === 1) {
      state.gender = 'Femenino'
    } else {
      state.gender = null
    }
    state.history_number = patient['history_number']
    state.contact = patient['contact']
    state.contact2 = patient['contact2']
    state.income_diagnosis = patient['income_diagnosis']
  },
  setPatients(state, patients) {
    patients.forEach(element => {
        if (element.gender === 1) {
        element.gender = 'Femenino' 
      } else {
        element.gender = 'Masculino'
      }
    })
    state.patients = patients
  },
}

const actions = {
  createPatient({ commit }, { token, patient }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/patient/',
        headers: { 'Authorization': `JWT ${token}` },
        data: {
          dni: patient.dni,
          first_name: patient.first_name,
          last_name: patient.last_name,
          birth_date: patient.birth_date,
          history_number: patient.history_number,
          gender: patient.gender === 'Masculino' ? 0 : 1,
          contact: patient.contact,
          contact2: patient.contact2,
          income_diagnosis: patient.income_diagnosis
        },
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err.response.data)
      })
    })
  },
  dischargePatient({ commit }, { token, bedId, doctorId, dni }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `http://127.0.0.1:8000/api/hospitalization/`,
        headers: { 'Authorization': `JWT ${token}` },
        data: {
          bed: bedId,
          doctor: doctorId,
          patient: dni,
          left_at: new Date()
        },
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.response.data)
      })
    })
  },
  editPatient({ commit }, { token, patient }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: `http://127.0.0.1:8000/api/patient/${patient.dni}/` ,
        headers: { 'Authorization': `JWT ${token}` },
        data: {
          dni: patient.dni,
          first_name: patient.first_name,
          last_name: patient.last_name,
          birth_date: patient.birth_date,
          history_number: patient.history_number,
          gender: patient.gender === 'Masculino' ? 0 : 1,
          contact: patient.contact,
          contact2: patient.contact2,
          income_diagnosis: patient.income_diagnosis
        },
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err.response.data)
      })
    })
  },
  deletePatient({ commit }, { token, dni }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: `http://127.0.0.1:8000/api/patient/${dni}/`,
        headers: { 'Authorization': `JWT ${token}` },
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
    })
  },
  obtainPatient({ commit }, { token, dni }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/patient/${dni}/`,
        headers: { 'Authorization': `JWT ${token}` },
      })
      .then(res => {
        commit('setPatient', res.data)
        commit('studies/setStudies', res.data.studies, { root:true })
        commit('progress/setProgress',res.data.progress, { root:true })
        resolve(res.data)
      })
      .catch(err => {
        commit('setPatient', {
          dni: null,
          age: null,
          first_name: null,
          last_name: null,
          birth_date: null,
          gender: null,
          history_number: null,
          contact: null,
          contact2: null,
          income_diagnosis: null,
        })
        reject(err)
      })
    })
  },
  obtainPatients({ commit }, token) {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/patient/',
      headers: { 'Authorization': `JWT ${token}` },
    })
    .then(res => {
      commit('setPatients', res.data)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
