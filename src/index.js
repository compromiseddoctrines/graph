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
        post: "1"
    },
    {
        id: "2",
        text: "Great!",
        author: "2",
        post: "2"
    },
    {
        id: "3",
        text: "the Best!",
        author: "3",
        post: "3"
    },
    {
        id: "2",
        text: "Marvelous!",
        author: "1",
        post: "1"
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
        createUser(data: CreateUserInput): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput{
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput{
        text: String!
        post: ID!
        author: ID!
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
        post: Post!
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
                return user.email === args.data.email
            })

            if(emailTaken){
                throw new Error('Email Taken.');
            }

            const user = {
                id: uuidv4(),
                name: args.data.name,
                email: args.data.email,
                age: args.data.age
            }

            users.push(user)

            return user
        },
        createPost(parent, args, ctx, info){
            // check if user exists
            const userExists = users.some((user) => user.id === args.data.author)
            
            if(!userExists){
                throw new Error('User not Found!')
            }

            const post = {
                id: uuidv4(),
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: args.data.author
                //...args when using spread operator the same as above except for ID
            }

            posts.push(post)

            return post
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => {
                return post.id === args.data.post && post.published 
            });

            if(!userExists){
                throw new Error('User not Found!')
            }

            if(!postExists){
                throw new Error('Post not Found!')
            }

            const comment = {
                id: uuidv4(),
                text: args.data.text,
                author: args.data.author,
                post: args.data.post 
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
        post(parent, arg, ctx, info){
            return posts.find((post) => {
                return post.id === parent.post
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