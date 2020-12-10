const Comment = {
    author(parent, arg, {db}, info){
        return db.users.find((user) =>{
            return user.id === parent.author
        })
    },
    post(parent, arg, {db}, info){
        return db.posts.find((post) => {
            return post.id === parent.post
        });
    }
}

export { Comment as default }