const graphql = require('graphql');
const _ = require('lodash');

const Book = require('../models/book')
const Author = require('../models/author')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

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
                // return _.find(authors,{id: parent.authorID})
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
                // return _.filter(books, {authorID: parent.id})
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorID: {type: GraphQLID}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorID: args.authorID
                });
                return book.save();
            }
        }
    }
})

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
                // return _.find(books,{id:args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args) {
                // return _.find(authors, {id: args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
            }
        },
        authors :{
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});