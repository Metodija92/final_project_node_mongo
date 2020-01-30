import axios from 'axios'

export function getJwt (data) {
    return {
        type: 'GET_JWT',
        payload: data
    }
}

export function getProducts (data) {
    return {
        type: 'GET_PRODUCTS',
        payload: data
    }
}

export function didUpdate (newState) {
    return {
        type: 'DID_UPDATE',
        state: newState
    }
}

export function changeNewToEditProduct (newState) {
    return {
        type: 'CHANGE_NEW_TO_EDIT',
        state: newState
    }
}

export function editThisProduct 
(id, productName, productType, productDescription, purchaseDate, productPrice) {
    return {
        type: 'EDIT_THIS_PRODUCT',
        payload: {
            id, productName, productType, productDescription, purchaseDate, productPrice
        }
    }
}


// Thunk actions test

export const userLoginIn = (email, password) => {
    return async () => {
        axios.post('https://desolate-escarpment-53492.herokuapp.com/api/v1/auth/login', {
            email: email,
            password: password
        })
        .then(res=>{
            localStorage.setItem('jwt', res.data.jwt);
            localStorage.setItem('name', res.data.first_name);
            localStorage.setItem('lastName', res.data.last_name);
        })
        .catch(err=>{
            console.log(err)
        });
    }
}

export const userRegister = (firstName, lastName, email, password, birthday, telephone, country) => {
    return async (dispatch) => {
        dispatch(createUserStarted());
        axios.post('https://desolate-escarpment-53492.herokuapp.com/api/v1/auth/register', {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                birthday: birthday,
                telephone: telephone,
                country: country,
                _created: new Date(),
            })
            .then(res => {
                setTimeout(() => {
                    dispatch(userLoginIn(email, password))
                }, 1000);
            })
            .catch(err=>{
                dispatch(createUserFailed());
                console.log(err)
            });
    }
}

export const getProductsCall = () => {
    return async (dispatch) => {
        dispatch(getAllPostsStarted());
        axios.get("https://desolate-escarpment-53492.herokuapp.com/api/v1/products/?sort=purchaseDate:desc", 
        { headers: {"Authorization" : `Bearer ${localStorage.getItem('jwt')}`}})
        .then(res=>{
            dispatch({
                type: 'GET_PRODUCTS',
                payload: res.data
            });
        })
        .catch(err=>{
            dispatch(getAllPostsFailed());
            console.log(err);
        })
    }
}

export const getProductsSorted = (sortQuery) => {
    return async (dispatch) => {
        dispatch(getAllPostsStarted());
        axios.get(`https://desolate-escarpment-53492.herokuapp.com/api/v1/products/?sort=${sortQuery}`,
        { headers: {"Authorization" : `Bearer ${localStorage.getItem('jwt')}`}})
        .then(res=>{
            dispatch({
                type: 'GET_PRODUCTS',
                payload: res.data
            });
            dispatch({
                type: 'DID_UPDATE',
                payload: false
            });
        })
        .catch(err=>{
            dispatch(getAllPostsFailed());
            console.log(err)
        });
    }
}

export const getExpencesFiltered = (from, to) => {
    return async (dispatch) => {
        dispatch(getAllPostsStarted());
        axios.get(`https://desolate-escarpment-53492.herokuapp.com/api/v1/products/?date_from=${from}&date_to=${to}&sort=purchaseDate:desc`,
        { headers: {"Authorization" : `Bearer ${localStorage.getItem('jwt')}`}})
        .then(res=>{
            dispatch({
                type: 'GET_PRODUCTS',
                payload: res.data
            });
        })
        .catch(err=>{
            dispatch(getAllPostsFailed());
            console.log(err)
        })
    }
}

export const createNewProduct = (name, type, description, date, price) => {
    return async (dispatch) => {
        dispatch(createOrEditStarted());
        axios.post('https://desolate-escarpment-53492.herokuapp.com/api/v1/products/', {
            productName: name,
            productType: type,
            productDescription: description,
            purchaseDate: date,
            productPrice: price,
            _created: new Date()
        }, { headers: {"Authorization" : `Bearer ${localStorage.getItem('jwt')}`}})
        .then(res => {
            // console.log(res);
            dispatch(createOrEditSuccess());
            dispatch({
                type: 'DID_UPDATE',
                state: true
            });
        })
        .catch(err => {
            dispatch(createOrEditFailed());
            console.log(err);
        });
    }
}

export const editExistingProduct = (id, name, type, description, date, price) => {
    return async (dispatch) => {
        dispatch(createOrEditStarted());
        axios.put(`https://desolate-escarpment-53492.herokuapp.com/api/v1/products/${id}`, {
            productName: name,
            productType: type,
            productDescription: description,
            purchaseDate: date,
            productPrice: price,
            _modified: new Date()
        }, { headers: {"Authorization" : `Bearer ${localStorage.getItem('jwt')}`}})
        .then(res => {
            // console.log(res);
            dispatch(createOrEditSuccess());
            dispatch({
                type: 'CHANGE_NEW_TO_EDIT',
                state: false
            });
            dispatch({
                type: 'DID_UPDATE',
                state: true
            });
        })
        .catch(err => {
            console.log(err);
            dispatch(createOrEditFailed());
            alert('All the fields must be filled out in order to edit your product succesfuly!')
        });
    }
}

export const deleteProduct = (id) => {
    return async () => {
        axios.delete(`https://desolate-escarpment-53492.herokuapp.com/api/v1/products/${id}`,
        { headers: {"Authorization" : `Bearer ${localStorage.getItem('jwt')}`}})
        .then(res => {
            // console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }
}

const createUserStarted = () => {
    return {
        type: 'CREATE_USER_STARTED'
    }
}

const createUserFailed = () => {
    return {
        type: 'CREATE_USER_FAILED'
    }
}

export const createUserSuccess = () => {
    return {
        type: 'CREATE_USER_SUCCESS'
    }
}

const getAllPostsStarted = () => {
    return {
        type: 'GET_ALL_POSTS_STARTED'
    }
}

const getAllPostsFailed = () => {
    return {
        type: 'GET_ALL_POSTS_FAILED'
    }
}

const createOrEditStarted = () => {
    return {
        type: 'CREATE_OR_EDIT_PRODUCT_STARTED'
    }
}

const createOrEditFailed = () => {
    return {
        type: 'CREATE_OR_EDIT_PRODUCT_FAILED'
    }
}

const createOrEditSuccess = () => {
    return {
        type: 'CREATE_OR_EDIT_PRODUCT_SUCCESS'
    }
}
