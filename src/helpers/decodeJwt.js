import jwt_decode from 'jwt-decode'
 

export const decodeJwt = (token) => {
    return decoded = jwt_decode(token);
};