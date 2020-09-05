import {
    INTRO,
    QUESTION_1,
    QUESTION_2,
    QUESTION_3,
    QUESTION_4,
    QUESTION_5,
    START_TIME,
    SURVEY_DATA,
    SURVEY_ENABLED,
    TOUR,
    USER_EVENTS
} from "./constants";
import {externalTrustPersonaNames} from "./miner_util";
import {ExternalTrustPersona} from "../model/ExternalTrustPersona";
import axios from 'axios';
import publicIp from "public-ip";

/**
 * Makes a post request to the survey backend
 */
export async function surveyPost() {
    let backendUrl = process.env.BACKEND_URL || "http://localhost:5000/"
    let data = localStorage.getItem(SURVEY_DATA)
    if (data) {
        let data_json = JSON.parse(data)
        console.log(data_json)
        return axios.post(backendUrl + "survey", data_json)
    } else return undefined
}

/**
 * Checks if a survey is currently running
 */
export const surveyEnabled = () => localStorage.getItem(SURVEY_ENABLED) === "true"

/**
 * Updates the currently stored survey data with new values
 * @param newValues a dictionary of the new values
 */
export function updateSurveyData(newValues: { [key: string]: any }) {
    let surveyString = localStorage.getItem(SURVEY_DATA)
    if (surveyString) {
        let surveyData = JSON.parse(surveyString)
        Object.entries(newValues).forEach(([key, value]) => {
            surveyData[key] = value
        })
        localStorage.setItem(SURVEY_DATA, JSON.stringify(surveyData))
        console.log(`Survey Data updated`)
    } else {
        localStorage.setItem(SURVEY_DATA, JSON.stringify({}))
        updateSurveyData(newValues)
    }
}

/**
 * Saves any event to the user survey history
 * @param id the event id
 * @param type the event type (click, answer, etc.)
 * @param state the current action state (for example selected menu option)
 */
export function saveEvent(id: string, type: string, state?: string) {
    if (surveyEnabled()) {
        let surveyString = localStorage.getItem(SURVEY_DATA)
        if (surveyString) {
            let surveyObject = JSON.parse(surveyString)
            let currentData = surveyObject[USER_EVENTS] || []
            currentData.push(
                {
                    "event_id": id,
                    "type": type,
                    "timestamp": new Date(),
                    "state": (state ? state : undefined)
                }
            )
            updateSurveyData({[USER_EVENTS]: currentData})
        } else {
            localStorage.setItem(SURVEY_DATA, JSON.stringify({}))
            saveEvent(id, type, state)
        }
    }
}

/**
 * Deletes all stored survey data
 */
export function deleteSurvey() {
    localStorage.removeItem(SURVEY_DATA)
    localStorage.removeItem(START_TIME + INTRO)
    localStorage.removeItem(START_TIME + TOUR)
    localStorage.removeItem(START_TIME + QUESTION_1)
    localStorage.removeItem(START_TIME + QUESTION_2)
    localStorage.removeItem(START_TIME + QUESTION_3)
    localStorage.removeItem(START_TIME + QUESTION_4)
    localStorage.removeItem(START_TIME + QUESTION_5)
}

/**
 * Check if a new trust persona is created (survey checkpoint)
 */
export function checkTrustPersonaCreated(): boolean {
    let external = externalTrustPersonaNames()
    return !!external.find(name => name === "Distributor");
}

/**
 * Checks if the specific trust policy for distributor trust persona exists (survey checkpoint)
 * @param externalTrustPersonas the dictionary of all external trust personas
 */
export function checkPolicyExists(externalTrustPersonas: ExternalTrustPersona[]): boolean {
    let distributorPersona = externalTrustPersonas.find(persona => persona.name === "Distributor")
    if (distributorPersona) {
        let collaboratorIssues = distributorPersona.trustIssues["Sender"]
        if (collaboratorIssues) {
            let matchUncertainty = collaboratorIssues
                .find(uncertainty =>
                    uncertainty.trustConcern === "Integrity" && uncertainty.component === "bpmn:UserTask")
            return !matchUncertainty;
        } else return false
    } else return false
}

/**
 * Get the currently elapsed time after starting the timer
 * @param id the timer id
 */
export function getTimeElapsed(id: string): number {
    let endTime = new Date().getTime()
    let dateString = localStorage.getItem(START_TIME + id)
    if (dateString) {
        return endTime - new Date(dateString).getTime()
    } else return 0
}

/**
 * Starts the timer and stores the start locally
 * @param id the timer id
 */
export function startTimer(id: string) {
    let startTime = new Date()
    localStorage.setItem(START_TIME + id, startTime.toString())
}

/**
 * Saves the duration of a timer into local storage
 * @param id the given id
 */
export function saveTime(id: string) {
    if (surveyEnabled()) {
        let introTime = getTimeElapsed(id)
        let identifier = id + "_duration"
        updateSurveyData({[identifier]: introTime})
    }
}

/**
 * fetches and saves the public ip of the user into the survey entity for tracking purposes
 */
export async function savePublicIp() {
    let ip = await publicIp.v4()
    updateSurveyData({"user_ip": ip})
}

/**
 * List of all survey task texts
 */
export const surveyTexts = [
    'Add a new external trust persona called "Distributor". Switch to this trust persona.',
    'Add a trust policy for Distributor with Trust Entity "Sender", Process Element "User Task" and Integrity as a trust concern.',
    'Go back to the dashboard. What amount of critical uncertainties from the perspective of the Distributor does Sender have?',
    'Go to the modeler. How many uncertainties does the task "prepare parcel" have?',
    'Export a trust report and save it locally.'
]