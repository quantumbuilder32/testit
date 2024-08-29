
const Epub = require("epub-gen")
const path = require("path")
    
const option = {
    title: "Alice's Adventures in Wonderland", // *Required, title of the book.
    author: "Lewis Carroll", // *Required, name of the author.
    publisher: "Macmillan & Co.", // optional
    cover: "https://images.pexels.com/photos/16534745/pexels-photo-16534745/free-photo-of-pavilions-on-gadisar-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Url or File path, both ok.
    content: [
        {
            title: "About the author", // Optional
            author: "John Doe", // Optional
            data: "<h2>Charles Lutwidge Dodgson</h2>"
            + "<div lang=\"en\">Better known by the pen name Lewis Carroll...</div>" // pass html string
        },
        {
            title: "Down the Rabbit Hole",
            data: "<p>Alice was beginning to get very tired...</p>"
        },
    ]
};
    
const workingDirectory = path.join(process.cwd(), "Epubs", "ebook_1724906158073.epub")
 
new Epub(option, workingDirectory).promise.then(
    () => console.log("Ebook Generated Successfully!"),
    err => console.error("Failed to generate Ebook because of ", err)
)
