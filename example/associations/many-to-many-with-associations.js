var Promise, collections, connections, setupWaterline;

Promise = require('bluebird');

setupWaterline = Promise.promisify(require('../raw/bootstrap'));

connections = {
    associations: {
        adapter: 'sails-orientdb',
        host: 'localhost',
        port: 2424,
        user: 'root',
        password: 'root',
        database: 'example-waterline-manyToMany',
        options: {
            databaseType: 'graph',
            unsafeDrop: 'true',
            storage: 'memory'
        }
    }
};

collections = {
    celebrity: {
        migrate: 'drop',
        tableName: 'celebrityTable',
        identity: 'celebrity',
        connection: 'associations',
        attributes: {
            name: 'string',
            people: {
                collection: 'person',
                through: 'likes',
                via: 'celebrity'
            }
        }
    },
    person: {
        migrate: 'drop',
        tableName: 'personTable',
        identity: 'person',
        connection: 'associations',
        attributes: {
            name: 'string',
            celebrities: {
                collection: 'celebrity',
                through: 'likes',
                via: 'person'
            }
        }
    },
    likes: {
        migrate: 'drop',
        tableName: 'likesTable',
        identity: 'likes',
        connection: 'associations',
        attributes: {
            since: 'date',
            "in": {
                model: 'person',
                columnName: 'person'
            },
            out: {
                model: 'celebrity',
                columnName: 'celebrity'
            }
        }
    }
};

setupWaterline({
    collections: collections,
    connections: connections
}).then(function (ontology) {
    return Promise.join(ontology.collections.celebrity.create({
        name: 'Megan Fox'
    }), ontology.collections.person.create({
        name: 'John Smith'
    }), function (celebrity, person) {
        return ontology.collections.likes.create({
            since: new Date(),
            "in": celebrity.id,
            out: person.id
        });
    });
}).finally(process.exit);
