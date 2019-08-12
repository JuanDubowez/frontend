import axios from 'axios'

const state = {
  bed: null,
  doctor: null,
  error: null,
}

const mutations = {
  setBed(state, bed) { 
    state.bed = bed
  },
  setDoctor(state, doctor) {
    state.doctor = doctor
  },
  setError(state, error) {
    state.error = error
  },
}

const actions = {
  createHospitalization({ commit }, { token, bedId, doctorId, patientDni }) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `http://127.0.0.1:8000/api/hospitalization/`,
        headers: { 'Authorization': `JWT ${token}` },
        data: {
          bed: bedId,
          doctor: doctorId,
          patient: patientDni,
          progress: {
            diagnosis: 'Asd',
            description: 'desc',
            status: 0
          },
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
  obtainHospitalizationPatient({ commit }, { token, dni }) {
    axios({
      method: 'get',
      url: `http://127.0.0.1:8000/api/hospitalization/${dni}/patient_filter/`,
      headers: { 'Authorization': `JWT ${token}` },
    })
    .then(res => {
      let bedId = res.data.bed
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/bed/${bedId}/`,
        headers: { 'Authorization': `JWT ${token}` },
      })
      .then(res => {
        commit('setBed', res.data)
        commit('setError', null)
      })
    })
    .catch(err => {
      commit('setError', err.response.data.detail)
      commit('setBed', null)
    })
  },
  obtainHospitalization({ commit, dispatch }, { token, bedId }) {
    axios({
      method: 'get',
      url: `http://127.0.0.1:8000/api/hospitalization/${bedId}/bed_filter/`,
      headers: { 'Authorization': `JWT ${token}` },
    })
    .then(res => {
      let doctorId = res.data.doctor
      let dni = res.data.patient
      dispatch('patient/obtainPatient', { token, dni }, { root: true })
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/api/doctor/${doctorId}/`,
        headers: { 'Authorization': `JWT ${token}` },
      })
      .then(res => {
        commit('setDoctor', res.data)
        commit('setError', null)
      })
    })
    .catch(err => {
      commit('setDoctor', null)
      let detailError = err.response.data.detail
      commit('setError', detailError)
      commit(
        'patient/setPatient',
        {
          dni: null,
          age: null,
          first_name: null,
          last_name: null,
          birth_date: null,
          gender: null,
          history_number: null,
          income_diagnosis: null,
        },
        { root: true },
      )
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
