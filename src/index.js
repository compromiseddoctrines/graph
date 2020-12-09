const { ApolloServer } = require('apollo-server');

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
        author: "1"
    },
    {
        id: "2",
        title: "Zues",
        body: "Thunder god!",
        published: true,
        author: "2"
    },  
    {
        id: "3",
        title: "Chronus",
        body: "The god of time",
        published: true,
        author: "3"
    }
]

// Type Def Schema
const typeDefs = `
    type Query{
        users(query: String): [User!]!
        post: Post!
        me: User!
        posts: [Post!]!
        
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
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
       }

    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
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