// creates random ID for ID schema
import { v4 as uuidv4 } from 'uuid';

const Mutation = {
    createUser(parent, args, {db}, info){
        // check if user email is taken
        const emailTaken = db.users.some((user) => {
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

        db.users.push(user)

        return user
    },
    createPost(parent, args, {db}, info){
        // check if user exists
        const userExists = db.users.some((user) => user.id === args.data.author)
        
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

        db.posts.push(post)

        return post
    },
    createComment(parent, args, {db}, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => {
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

        db.comments.push(comment)

        return comment
    },
    updateUser(parents, args, {db}, info){
        // destructure args
        const {id, data} = args
        
        //find if user exist
        const user = db.users.find((user) => user.id === id)

        if(!user){
            throw new Error('User Not Found!');
        }

        if(typeof data.email === 'string'){
            const emailTaken = db.users.some((user) => user.email === data.email)

            if(emailTaken){
                throw new Error('Email has been used!');
            }

            user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name
        }

        if(typeof data.age !== 'undefined' ){
            user.age = data.age
        }

        return user
    },
    updatePost(parent, args, {db}, info){
        const {id, data} = args

        const post = db.posts.find((post) => post.id === id)

        if(!post){
            throw new Error('Post not found');
        }

        if(typeof data.title === 'string'){
            post.title = data.title
        }

        if(typeof data.body === 'string'){
            post.body = data.body
        }

        if(typeof data.published === 'boolean'){
            post.published = data.published
        }

        return post
    },
    updateComment(parent, args, {db}, info){
        const {id, data} = args
        
        const comment = db.comments.find((comment) => comment.id === id)

        if(!comment){
            throw new Error('Comment not Found!');
        }

        if(typeof data.text === 'string'){
            comment.text = data.text
        }

        return comment
    },
    deleteUser(parent, args, {db}, info){
        //check if user exist
        const userIndex = db.users.findIndex((user) => {
            return user.id === args.id
        })

        if(userIndex === -1){
            throw new Error('User Not Found!')
        }

        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id

            // if match is going to be deleted
            if(match){
                db.comments = db.comments.filter((comment) => {
                    return comment.post !== post.id
                })
            }

            return !match
        })

        db.comments = db.comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0];
    },
    deletePost(parent, args, {db}, info){
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        
        if(postIndex === -1){
            throw new Error('Post Not Found!')
        }

        const deletePosts = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        return deletePosts[0]
    },
    deleteComment(parent, args, {db}, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
    
        if(commentIndex === -1){
            throw new Error('Comment not Found!')
        }

        const deleteComments = db.comments.splice(commentIndex,1)

        return deleteComments[0]
    }
}

export { Mutation as default }