'use strict'

const PhotoRepository = require('./photoRepository');
const expect = require('chai').expect;

const testPhotoId = 1;

let testee;


describe('Testing image repo', () => {
    beforeEach(function init() {
        testee = new PhotoRepository();
        testee.add(
            {
                description: 'My Cat',
                url: 'http://mysite.com/cat'
            }
        );
    });

    describe('Required methods', () => {
        it('Should have add method', () => {
            expect(testee.add).to.be.a('function')
        });
        it('Should have get method', () => {
            expect(testee.get).to.be.a('function')
        });
        it('Should have remove method', () => {
            expect(testee.remove).to.be.a('function')
        });
        it('Should have edit method', () => {
            expect(testee.edit).to.be.a('function')
        });
        it('Should have find method', () => {
            expect(testee.find).to.be.a('function')
        });
    });

    describe('Add/retrieve logic', () => {
        it('Should return id for a new image', () => {
            testee = new PhotoRepository();
            expect(testee.add(
                {
                    description: 'My Cat',
                    url: 'http://mysite.com/cat'
                }
            )).to.be.equal(testPhotoId);

        });

        it('Should throw if description or url or entire object is null', () => {

            expect(
                function () {
                    testee.add(
                        {
                            url: 'http://mysite.com/cat'
                        }
                    )
                }
            ).to.throw(Error);

            expect(
                function () {
                    testee.add(
                        {
                            description: 'My Cat'
                        }
                    )
                }
            ).to.throw(Error);

            expect(testee.add).to.throw(Error);
        });

        it('Should return image by id', () => {
            const photo = testee.get(testPhotoId);

            expect(photo.url).to.be.equal('http://mysite.com/cat');

            expect(photo.id).to.be.equal(testPhotoId);

            expect(photo.description).to.be.equal('My Cat');
        });

        it('Should throw if id is null', () => {

            expect(testee.get).to.throw(Error);

        });
    });

    describe('Remove logic', () => {

        it('Should throw if id is null', () => {

            expect(testee.remove).to.throw(Error);

        });

        it('Should throw if id is not a string', () => {

            expect(
                function () {
                    testee.remove(
                        function iAmNotAValidArgumentHere() {
                        }
                    )
                }).to.throw(Error);

            expect(
                function () {
                    testee.remove(
                        {
                            whoAmI: "I am object at the wrong time and place"
                        }
                    )
                }).to.throw(Error);

        });

        it('Should remove photo by id', () => {

            expect(testee.get(testPhotoId)).to.be.an('object');

            testee.remove(testPhotoId);

            expect(testee.get(testPhotoId)).to.be.a('null');
        });

        it('Should do nothing if trying to remove not existing photo', () => {

            expect(testee.get('some-not-existing-id')).to.be.a('null');

            testee.remove(testPhotoId);
        });
    });

    describe('Edit logic', () => {

        it('Should throw if object is empty', () => {

            expect(testee.edit).to.throw(Error);

        });

        it('Should throw if id is empty', () => {
            expect(
                function () {
                    testee.edit(
                        {
                            url: 'http://mysite.com/cat'
                        }
                    )
                }).to.throw(Error);

        });

        it('Should throw if photo with such id does not exists', () => {
            expect(
                function () {
                    testee.edit(
                        {
                            id: 'not-existing-id'
                        }
                    )
                }).to.throw(Error);

        });

        it('Should update description', () => {
            const newDescription = 'My Dog';
            testee.edit(
                {
                    id: testPhotoId,
                    description: newDescription
                }
            );

            const updatedPhoto = testee.get(testPhotoId);

            expect(updatedPhoto.url).to.be.equal('http://mysite.com/cat');
            expect(updatedPhoto.id).to.be.equal(testPhotoId);
            expect(updatedPhoto.description).to.be.equal(newDescription);
        });

        it('Should update url', () => {
            const newUrl = 'http://mysite.com/dog';
            testee.edit(
                {
                    id: testPhotoId,
                    url: newUrl
                }
            );

            const updatedPhoto = testee.get(testPhotoId);

            expect(updatedPhoto.url).to.be.equal(newUrl);
            expect(updatedPhoto.id).to.be.equal(testPhotoId);
            expect(updatedPhoto.description).to.be.equal('My Cat');
        })
    })

    describe('Find logic', () => {
        let myCatId, myDogId, myDoggyId;

        beforeEach(function addObjects() {
            testee = new PhotoRepository();

            myCatId = testee.add(
                {
                    description: 'My Cat',
                    url: 'http://mysite.com/cat'
                }
            );
            myDogId = testee.add(
                {
                    description: 'My Dog',
                    url: 'http://mysite.com/cat'
                }
            );
            myDoggyId = testee.add(
                {
                    description: 'My doggy, catty',
                    url: 'http://mysite.com/cat'
                }
            );
        });

        it('Should throw if keyword is empty', () => {

            expect(testee.find).to.throw(Error);

        });

        it('Should find by exact match regardless of the case', () => {
            expect(testee.find(`Dog`)).have.length(1).and.contain(myDogId);
            expect(testee.find(`dOg`)).have.length(1).and.contain(myDogId);
            expect(testee.find(`dOggY`)).have.length(1).and.contain(myDoggyId);
            expect(testee.find(`my`)).have.length(3).and.contain(myDogId, myCatId, myDoggyId);
        });

    })
});