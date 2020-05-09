const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// dummy data
var books = [
{name:'books of the wild', genre:'fiction', id:'123'},
{name:'books of the city', genre:'fact', id:'420'},
{name:'books of the galaxy', genre:'sci-fi', id:'69'},
];
// schema
const BookType = new GraphQLObjectType({
    name:'Book',
    fields: ()=>({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        genre: {type: GraphQLString}
    })
});

// root queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args:{id:{type: GraphQLString}},
            resolve(parent, args){
                // code to get data from db/other source
                return _.find(books,{id:args.id});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});