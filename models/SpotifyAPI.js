const axios = require("axios");
const request = require('request');

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET, NUM_TOP_TRACKS, NUM_TOP_ARTISTS } = require("../config");


class SpotifyAPI {
    
    //Reusable api request helper function
    static async apiRequest(endPoint, access_token) {
        const headers = {
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        let res = await axios.get(`${SPOTIFY_BASE_URL}${endPoint}`, headers);
        return res.data;
    }
    
    static async getCurrUser(access_token) {
        let res = await this.apiRequest("/me", access_token);
        return res;
    }

    static async getTopTracks(access_token) {
        let res = await this.apiRequest(`/me/top/tracks?limit=${NUM_TOP_TRACKS}&offset=0`, access_token);
        return res;
    }

    static async getTopArtists(access_token) {
        let res = await this.apiRequest(`/me/top/artists?limit=${NUM_TOP_ARTISTS}&offset=0`, access_token);
        return res;
    }

    static async getArtistDetails(access_token, artistId) {
        let res = await this.apiRequest(`/artists/${artistId}`, access_token);
        return res;
    }

    static async getTrackDetails(access_token, trackId) {
        let res = await this.apiRequest(`/tracks/${trackId}`, access_token);
        return res;
    }

    static async refreshUserToken(refresh_token) {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        const getToken = () => {
            return new Promise(function (resolve, reject) {
                request.post(authOptions, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        resolve(body.access_token);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }

        const access_token = await getToken();
        return access_token
    }
}

module.exports = SpotifyAPI;