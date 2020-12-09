const { ApolloServer } = require('apollo-server');
// creates random ID for ID schema
import { v4 as uuidv4 } from 'uuid';

//sample user data
const users = [
    {
        id: '1',
        name: 'Jon Mateo',
        email: 'compromiseddoctrines@gmail.com',
        age: 20
    },
    {
        id: '2',
        name: 'Nancy Salvador',
        email: 'nancysalvador@gmail.com',
        age: 20
    },
    {
        id: '3',
        name: 'Odin Son',
        email: 'odinson@gmail.com'
    }
];

const posts = [
    {
        id: "1",
        title: "Athena",
        body: "Lorem Ipsum",
        published: true,
        author: "1",
        comments: "1"
    },
    {
        id: "2",
        title: "Zues",
        body: "Thunder god!",
        published: true,
        author: "2",
        comments: "2"
    },  
    {
        id: "3",
        title: "Chronus",
        body: "The god of time",
        published: true,
        author: "3",
        comments: "3"
    }
]

const comments = [
    {
        id: "1",
        text: "Nice one!",
        author: "1",
        posts: "1"
    },
    {
        id: "2",
        text: "Great!",
        author: "2",
        posts: "2"
    },
    {
        id: "3",
        text: "the Best!",
        author: "3",
        posts: "3"
    },
    {
        id: "2",
        text: "Marvelous!",
        author: "1",
        posts: "1"
    }
]

// Type Def Schema
const typeDefs = `
    type Query{
        users(query: String): [User!]!
        post: Post!
        me: User!
        posts: [Post!]!
        comments: [Comment]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, post: ID!, author: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int,
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment{
        id: ID!
        text: String!
        author: User!
        posts: [Post!]!
    }
`;

const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if(!args.query){
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
           return{
               id: '5345fsdf43dff',
               name: 'Bon',
               email: 'compromiseddoctrines@gmail.com',
               age: 28
           }
       },
       posts(parent, args, ctx, info) {
            if(!args.query){
                return posts
            }
       },
       comments(parent, args, ctx, info){
           return comments
       }

    },
    Mutation:{
        createUser(parent, args, ctx, info){
            // check if user email is taken
            const emailTaken = users.some((user) => {
                return user.email === args.email
            })

            if(emailTaken){
                throw new Error('Email Taken.');
            }

            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            }

            users.push(user)

            return user
        },
        createPost(parent, args, ctx, info){
            // check if user exists
            const userExists = users.some((user) => user.id === args.author)
            
            if(!userExists){
                throw new Error('User not Found!')
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            }

            posts.push(post)

            return post
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.author)
            const postExists = posts.some((post) => {
                return post.id === args.post && post.published 
            });

            if(!userExists){
                throw new Error('User not Found!')
            }

            if(!postExists){
                throw new Error('Post not Found!')
            }

            const comment = {
                id: uuidv4(),
                text: args.text,
                author: args.author,
                post: args.post 
            }

            comments.push(comment)

            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.author === parent.id
            });
        }
    },
    User: {
        posts(parent, args, ctx, info){
            // for array relational data
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, arg, ctx, info){
            return users.find((user) =>{
                return user.id === parent.author
            })
        },
        posts(parent, arg, ctx, info){
            return posts.filter((post) => {
                return post.author === parent.id
            });
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });