import ProfileItem from "./components/Profile";

const profiles = [
  {
    name: "Mai Ting Kai",
    img: "https://media.licdn.com/dms/image/v2/C5603AQFTOIBiZRDubQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1659868517766?e=1736380800&v=beta&t=6uCl7A2pfEWbJvB5E8LspGKd9ndjjBeJBC8ZtmkW5Oo",
    linkedin: "https://www.linkedin.com/in/mai-ting-kai/",
    github: "https://github.com/tingkai-mai"
  },
  {
    name: "Soh Je Hou",
    img: "https://media.licdn.com/dms/image/v2/D5603AQEyvoPMbsO4ZQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1697231833209?e=1736380800&v=beta&t=hcXSW4YxkNhhPpt-58K_Ksw9QvJLQ80Mj-oStnsKRgk",
    linkedin: "https://www.linkedin.com/in/jehousoh/",
    github: "https://github.com/jehousoh"
  },
  {
    name: "Chrysline Lim Xing Hui",
    img: "https://media.licdn.com/dms/image/v2/D5603AQFFhrXlN0rxPA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1679269861667?e=1736380800&v=beta&t=rVfJih_Z1j80KoCuRwPvF5fEJm0waFTIiOI-MyeYyqU",
    linkedin: "https://www.linkedin.com/in/chrysline-lim-91320323a/",
    github: "https://github.com/ChryslineLim"
  },
  {
    name: "Jamie Toh Hui Lin",
    img: "https://media.licdn.com/dms/image/v2/C5603AQFqh_7ytNhdgg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1619188035985?e=1736380800&v=beta&t=_e92yUQXil7ImjZuuO0fNEzzutb_5CBfMxzxM6I0cWU",
    linkedin: "https://www.linkedin.com/in/jamie-toh-892305186/",
    github: "https://github.com/jamz903"
  },
  {
    name: "Izz Hafeez Bin Zek Hazley",
    img: "https://media.licdn.com/dms/image/v2/C4D03AQGqEGA0k1xRaw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1590071844974?e=1736380800&v=beta&t=whOuHWXjV-vE9muz0KYiurnytAVoHpsiBIj-X9xDgTs",
    linkedin: "https://www.linkedin.com/in/izzhafeez/",
    github: "https://github.com/izzhafeez"
  },
]

const AboutPage = () => {
  return (
    <div className="w-full grid p-4 mt-10">
      <div className="mx-auto max-w-6xl grid gap-4">
        <h1 className="text-yellow-500 text-6xl text-center">About Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <ProfileItem key={index} img={profile.img} name={profile.name} linkedin={profile.linkedin} github={profile.github} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;