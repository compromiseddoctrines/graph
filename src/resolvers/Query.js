const Query = {
    users(parent, args, {db}, info){
        if(!args.query){
            return db.users
        }

        return db.users.filter((user) => {
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
   posts(parent, args, {db}, info) {
        if(!args.query){
            return db.posts
        }
   },
   comments(parent, args, {db}, info){
       return db.comments
   }

}

export { Query as default }