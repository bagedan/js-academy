'use strict'
const log = console.log;


function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        log(message + `\n`);
        throw new Error(message);
    }
}

class Photo {
    constructor(id) {
        this.id = id;
    }

    withDescription(description) {
        this.description = description;
        return this;
    }

    withUrl(url) {
        this.url = url;
        return this;
    }

}

class PhotoRepository {

    constructor() {
        this.idToPhotoMap = {};
        this.searchIndex = {};

        // this my attempt to make internal datastaructures to not stick out that easy.
        // But I am aware that they are still kind of public anyway...
        Object.defineProperty(this, 'idToPhotoMap', {
            enumerable: false,
            writable: true
        });

        Object.defineProperty(this, 'searchIndex', {
            enumerable: false,
            writable: true
        });

        this.tokenizer = /\W+/;
    }

    add(photo) {
        assert(photo, "Cannot add empty photo object");
        assert(photo.url, 'Url has to be provided in photo object');
        assert(photo.description, 'Description has to be provided in image description');

        const numberOfStoredImages = Object.keys(this.idToPhotoMap).length;
        let newPhotoId = numberOfStoredImages + 1;
        log(`storing photo object [${JSON.stringify(photo)}] with id [${newPhotoId}]\n`);

        this.idToPhotoMap[newPhotoId] = new Photo(newPhotoId)
            .withDescription(photo.description)
            .withUrl(photo.url);

        //updating search index.
        // TODO - this must be extracted into something like a private function...
        const tokens = photo.description.toLowerCase().split(this.tokenizer);
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            log(`Adding photo with id [${newPhotoId}] into list for keyword [${token}]`);
            if (this.searchIndex[token]) {
                this.searchIndex[token].push(newPhotoId);
            } else {
                this.searchIndex[token] = [newPhotoId];
            }
        }



        return newPhotoId;
    }

    get(photoId) {
        assert(photoId, 'Cannot get photo for empty id');
        assert(typeof photoId === 'number' || typeof photoId === 'string',
            "Only accept number or string as photo id. (I know it's JS and the functions are the first-class, " +
            "but still, fuck it )");

        log(`Retrieving photo object for id [${photoId}]`);
        let result = this.idToPhotoMap[photoId];
        // awesome - I got all three brackets )}] in the row! :D
        log(`return photo object [${JSON.stringify(result)}]`);
        if(result){
            return result;
        } else {
            return null;
        }
    }

    remove(photoId) {
        assert(photoId, "Cannot use empty id to remove photo");
        assert(typeof photoId === 'number' || typeof photoId === 'string',
            "Only accept number or string as photo id. (I know it's JS and the functions are the first-class, " +
            "but still, fuck it )");

        if(this.idToPhotoMap[photoId]){
            log(`Removing photo with id [${photoId}]`);
            this.idToPhotoMap[photoId] = null;
        } else {
            log(`There is no photo with id [${photoId}]`);
        }
    };

    edit(updatedPhoto) {
        assert(updatedPhoto, `Update photo object is not provided`);
        assert(updatedPhoto.id, `Id for updated photo is not provided`);

        const photoId = updatedPhoto.id;

        assert(this.idToPhotoMap[photoId], `Photo with id [${photoId}] does not exists`);

        const photoToBeUpdated = this.idToPhotoMap[photoId];

        if(updatedPhoto.url){
            log(`Updating url for photo with id [${photoId}] from [${photoToBeUpdated.url}] to [${updatedPhoto.url}]`);
            photoToBeUpdated.url = updatedPhoto.url;
        }

        if(updatedPhoto.description){
            log(`Updating description for photo with id [${photoId}] from [${photoToBeUpdated.description}] to [${updatedPhoto.description}]`);
            photoToBeUpdated.description = updatedPhoto.description;
        }

    };

    find(keyword) {
        assert(keyword, "Cannot search with empty keyword");

        const normalizedKeyword = keyword.toLowerCase();

        if (this.searchIndex[normalizedKeyword]) {
            const result = this.searchIndex[normalizedKeyword];
            log(`for keyword [${normalizedKeyword}] found photos with ids [${result}]`);
            return result;
        } else {
            log(`No photos found for keyword [${normalizedKeyword}]`);
            return [];
        }
    };
}


module.exports = PhotoRepository;


