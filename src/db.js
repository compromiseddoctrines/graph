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
];

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
];

const db = {
    users,
    posts,
    comments
}

export { db as default }