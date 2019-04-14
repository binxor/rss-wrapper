'use strict';

const exec = require('child_process').exec;
const apikey = process.env.WATSON_API_KEY;
const Analyzer = require('watson-developer-cloud/tone-analyzer/v3');

class Watson {
    constructor() {
        let self = this;
        self.data = {
            text: 'test words'
        };
        self.config = {
            url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21',
            iamUrl: 'https://gateway.watsonplatform.net/tone-analyzer/api',
            version: '2017-09-21'
        };

        self.analyzer = new Analyzer({
            version: self.config.version,
            iam_apikey: apikey,
            url: self.config.iamUrl
        });

        self.paramsFactory = (text) => {
            return {
                tone_input: { 'text': text || '' },
                content_type: 'application/json'
            }
        };

        self.analyzeTone = (text) => {
            let params = self.paramsFactory(text);
            self.data.text = text;
            return self.analyzer.tone(params)
                .then(toneAnalysis => {
                    return toneAnalysis;
                })
                .catch(err => {
                    console.log('error:', err)
                    return err;
                })
        }
    }
}

module.exports = new Watson();