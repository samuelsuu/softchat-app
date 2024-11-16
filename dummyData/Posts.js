import friends from "./Friends"; // Import the friends data

const posts = [
  {
    id: "1",
    content: "This is the first post by John!",
    created_at: "2024-11-01",
    user: friends[0], // Reference the user John Doe
    image: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg", // Example image URL
  },
  {
    id: "2",
    content: "Enjoying the beautiful weather today.",
    created_at: "2024-11-02",
    user: friends[1], // Reference the user Jane Smith
    image: "https://gratisography.com/wp-content/uploads/2024/03/gratisography-vr-glasses-800x525.jpg", // Example image URL
  },
  {
    id: "3",
    content: "Just finished a great workout session.",
    created_at: "2024-11-03",
    user: friends[2], // Reference the user Mike Williams
    image: "https://gratisography.com/wp-content/uploads/2023/09/gratisography-duck-doctor-free-stock-photo-800x525.jpg", // Example image URL
  },
  {
    id: "4",
    content: "Trying out a new recipe for dinner tonight.",
    created_at: "2024-11-04",
    user: friends[3], // Reference the user Emily Jones
    image: "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg", // Example image URL
  },
  {
    id: "5",
    content: "I can't believe how fast this week flew by.",
    created_at: "2024-11-05",
    user: friends[4], // Reference the user David Brown
    image: "https://buffer.com/resources/content/images/size/w2000/2024/11/free-stock-image-sites.png", // Example image URL
  },
  {
    id: "6",
    content: "Exploring new hiking trails this weekend.",
    created_at: "2024-11-06",
    user: friends[5], // Reference the user Sophia White
    image: "https://gratisography.com/wp-content/uploads/2023/06/gratisography-retro-virtual-reality-free-stock-photo-800x525.jpg", // Example image URL
  },
  {
    id: "7",
    content: "Enjoying a relaxing afternoon with a good book.",
    created_at: "2024-11-07",
    user: friends[6], // Reference the user Chris Green
    image: "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg", // Example image URL
  },
  {
    id: "8",
    content: "Had an amazing lunch with friends today.",
    created_at: "2024-11-08",
    user: friends[7], // Reference the user Sam
    image: "https://gratisography.com/wp-content/uploads/2024/03/gratisography-vr-glasses-800x525.jpg", // Example image URL
  },
  {
    id: "9",
    content: "The sunset today was breathtaking.",
    created_at: "2024-11-09",
    user: friends[8], // Reference the user Olivia Black
    image: "https://gratisography.com/wp-content/uploads/2023/06/gratisography-strange-world-free-stock-photo-800x525.jpg", // Example image URL
  },
  {
    id: "10",
    content: "Looking forward to the weekend!",
    created_at: "2024-11-10",
    user: friends[9], // Reference the user Daniel Gray
    image: "https://gratisography.com/wp-content/uploads/2023/06/gratisography-flamingo-skateboard-free-stock-photo-800x525.jpg", // Example image URL
  },
  {
    id: "11",
    content: "Started a new art project today.",
    created_at: "2024-11-11",
    user: friends[10], // Reference the user Ava Silver
    image: "https://gratisography.com/wp-content/uploads/2023/09/gratisography-duck-doctor-free-stock-photo-800x525.jpg", // Example image URL
  },
];

export default posts;
