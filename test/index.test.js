const expect = require('chai').expect;
const nock = require('nock');

// tests
const getFeed = require('../server').getFeed;
const response = require('./wired_business');

describe('RSS Feed Unit test', () => {
    // nock
    beforeEach(() => {
        nock('https://www.wired.com')
            .get('/feed/category/business/latest/rss')
            .reply(200, response);
    })

    // chai
    it('Get rss feed', () => {
        return getFeed()
            .then(res => {
                expect(typeof res).to.equal('object');
                expect(typeof res.feed).to.equal('object');
                expect(typeof res.categories).to.equal('object');
                expect(typeof res.words).to.equal('string')
            })
    })
})