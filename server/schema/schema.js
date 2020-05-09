const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

// dummy data
var books = [
{name:'books of the wild', genre:'Fantasy', id:'123', authorID: '1'},
{name:'books of the city', genre:'Fact', id:'420', authorID: '2'},
{name:'books of the galaxy', genre:'Sci-Fi', id:'69', authorID: '2'},
{name:'piano for beginners', genre: 'Self-Development', id:'9', authorID: '3'},
{name:'javascript for dummies', geenre: 'Technology', id:'32', authorID: '3'}
];
var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' },
];
// schema
const BookType = new GraphQLObjectType({
    name:'Book',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        authorID : {
            type: AuthorType,
            resolve(parent, args){
                // console.log(parent);
                return _.find(authors,{id: parent.authorID})
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // console.log(parent);
                return _.filter(books, {authorID: parent.id})
            }
        }
    })
});
// root queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                // code to get data from db/other source
                // console.log(typeof args.id)
                return _.find(books,{id:args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args) {
                return _.find(authors, {id: args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        authors :{
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});