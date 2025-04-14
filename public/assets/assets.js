import Actvity_Area from './icons/Actvity_Area.svg';
import Add from './icons/Add.svg';
import Admin from './icons/Admin.svg';
import Back from './icons/Back.svg';
import Buildings from "./icons/Buildings.svg";
import Cafeteria from "./icons/Cafeteria.svg";
import Campus_Map from "./icons/Campus_Map.svg";
import Close from "./icons/Close.svg";
import Dropdown from "./icons/Dropdown.svg";
import Faculty from "./icons/Faculty.svg";
import Fit_to_Screen from "./icons/Fit_to_Screen.svg";
import House from "./icons/House.svg";
import Library from "./icons/Library.svg";
import Location from "./icons/Location.svg";
import Menu from "./icons/Menu.svg";
import Minus from "./icons/Minus.svg";
import My_Classes from "./icons/My_Classes.svg";
import Next from "./icons/Next.svg";
import Save_schedule from "./icons/Save_schedule.svg";
import Sign_Out from "./icons/Sign_Out.svg";
import Trash from "./icons/Trash.svg";
import Clinic from "./icons/Clinic.svg";
import Cottage from "./icons/Cottage.svg";
import Security from "./icons/Security.svg";
import Car from "./icons/Car.svg";
import Basketball from "./icons/Basketball.svg";
import Soccer from "./icons/Soccer.svg";
import Volleyball from "./icons/Volleyball.svg";
import Star from "./icons/Star.svg";

export const assets = {
    Actvity_Area,
    Add,
    Admin,
    Back,
    Buildings,
    Cafeteria,
    Campus_Map,
    Close,
    Dropdown,
    Faculty,
    Fit_to_Screen,
    House,
    Library,
    Location,
    Menu,
    Minus,
    My_Classes,
    Next,
    Save_schedule,
    Sign_Out,
    Trash,
    Clinic,
    Cottage,
    Security,
    Car,
    Basketball,
    Soccer,
    Volleyball,
    Star
}


export const buildingsData = [
    {name:"Administration Building", index: "1", icon: assets.Buildings},
    {name:"Science Building", index: "2", icon: assets.Buildings},
    {   
        name:"Technology Innovation Center Bldg.", 
        index: "3", 
        icon: assets.Cafeteria,
        children:[
            {name:"Cafeteria", index: "3a", icon: assets.Cafeteria},
            {name:"Clinic", index: "3b", icon: assets.Clinic},
        ],
    },
    {name:"Library Building", index: "4", icon: assets.Library},
    {
        name: "Residence Halls",
        index: "5",
        icon: assets.House,
        children: [
          { name: "Balay Varangao", index: "5a", icon: assets.House },
          { name: "Lalahon Hall", index: "5b", icon: assets.House },
          { name: "Liadlaw Hall", index: "5c", icon: assets.House },
          { name: "Lihangin Hall", index: "5d", icon: assets.House },
        ],
    },
    {
        name: "School of Management",
        index: "6",
        icon: assets.Buildings,
        children: [
          { name: "Management Administration", index: "6a", icon: assets.Buildings },
          { name: "Management Bldg. 1", index: "6b", icon: assets.Buildings },
          { name: "Management Bldg. 2", index: "6c", icon: assets.Buildings },
        ],
    },
    {name:"Undergraduate Building", index: "7", icon: assets.Buildings},
    {name:"Arts and Design Workshop Bldg.", index: "8", icon: assets.Buildings},
    {name:"Arts and Design Workshop Bldg. 2", index: "9", icon: assets.Buildings},
    {name:"Arts and Science Extension Bldg. (ASX)", index: "10", icon: assets.Buildings},
    {
        name: "Arts and Sciences (AS) Bldg.",
        index: "11",
        icon: assets.Buildings,
        children: [
          { name: "AS Conference Hall", index: "11a", icon: assets.Buildings },
          { name: "AS East Wing", index: "11b", icon: assets.Buildings },
          { name: "AS West Wing", index: "11c", icon: assets.Buildings },
        ],
    },
    {name:"Union Building", index: "12", icon: assets.Buildings},
    {name:"Cebu Cultural Center", index: "13", icon: assets.Buildings},
    {name: "High School Area", index: "14", icon: assets.Buildings}
]

export const activityAreaData = [
    {name:"Oblation Square", index: "A1", icon: assets.Buildings},
    {name:"Admin Cottages", index: "A2", icon: assets.Cottage},
    {name:"Malacañang Cottage", index: "A3", icon: assets.Cottage},
    {name:"Admin Field", index: "A4", icon: assets.Actvity_Area},
    {name:"College Mini Stage", index: "A5", icon: assets.Star},
    {name:"Undergraduate Cottages", index: "A6", icon: assets.Cottage},
    {name:"SOM Basketball Court", index: "A7", icon: assets.Basketball},
    {name:"Volleyball Court", index: "A8", icon: assets.Volleyball},
    {name:"Amphitheater/Sunset Garden", index: "A9", icon: assets.Star},
    {name:"High School Open Field", index: "A10", icon: assets.Actvity_Area},
    {name:"High School Open Court", index: "A11", icon: assets.Star},
    {name:"High School Covered Court", index: "A12", icon: assets.Star},
    {name:"Soccer Field", index: "A13", icon: assets.Soccer}
]

export const securityAndParkingData = [
    {name:"Entrance Gate Guard House", index: "G1", icon: assets.Security},
    {name:"Exit Gate Guard House", index: "G2", icon: assets.Security},
    {name:"High School Guard House", index: "G3", icon: assets.Security},
    {name:"AS Guard House", index: "G4", icon: assets.Security},
    {name:"Parking Lot", index: "P1", icon: assets.Car},
]

export const libraryBuildingData = [
    {floor:"1st Floor",
        children:[
            {room:"Learning Commons"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"2nd Floor",
        children:[
            {room:"Audio Visual Room (AVR 1)"},
            {room:"Performing Arts Hall (PAH)"},
        ]
    },
]


export const cosBldgData = [
    {floor:"1st Floor",
        children:[
            {room:"Office of the University Registrar"},
            {room:"Cashier Office"},
            {room:"College of Science Dean Office"},
            {room:"College of Science Secretary Office"},
            {room:"Bids and Awards Committee Office"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"Mezzanine Floor",
        children:[
            {room:"Legal Office"},
            {room:"Resident Psychologist Office"},
            {room:"Faculty Lounge"},
            {room:"Human Resources and Development Office"},
            {room:"Stock Room"},
        ]
    },
    {floor:"2nd Floor",
        children:[
            {room:"Math and Statistics Office"},
            {room:"Math-Stat Laboratory Rooms"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"3rd Floor",
        children:[
            {room:"Department of Computer Science (DCS) Faculty Room"},
            {room:"DCS Laboratory Rooms"},
            {room:"DCS Mini Library"},
            {room:"DCS Mini Conference Room"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"4th Floor",
        children:[
            {room:"DCS Lecture Rooms"},
            {room:"DCS Teaching Labs"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"5th Floor",
        children:[
            {room:"Biology Faculty Room"},
            {room:"Biology Lecture Rooms"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"6th Floor",
        children:[
            {room:"Histology Laboratory"},
            {room:"Botany Laboratory "},
            {room:"Zoology Laboratory "},
            {room:"Molecular Biology and Genetics Laboratory "},
            {room:"Comfort Rooms"},
        ]
    },
]

export const administrationBuildingData = [
    {floor:"1st Floor",
        children:[
            {room:"Office of the Chancellor"},
            {room:"Myths Cafe"},
            {room:"Mindscapes"},
            {room:"Office of the Vice Chancellor for Academic Affairs"},
            {room:"Office of the Vice Chancellor for Administration"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"2nd Floor",
        children:[
            {room:"Office of the Student Affairs"},
            {room:"ILC - Audio Visual Room"},
            {room:"Boardroom"},
            {room:"Office of the Campus Architect"},
            {room:"Office for Initiatives in Culture and the Arts"},
            {room:"Staff Lounge"},
        ]
    },
]

export const artsAndSciencesBuildingData = [
    {floor:"1st Floor",
        children:[
            {room:"AS Conference Hall"},
            {room:"College of Social Sciences Faculty Rooms"},
            {room:"Student Council Office"},
            {room:"Tug-ani Office"},
            {room:"Comfort Rooms"},
        ]
    },
    {floor:"2nd Floor",
        children:[
            {room:"NSTP Faculty Office"},
            {room:"Mathematics Lecture Rooms"},
            {room:"Information Technology Center Office"},
            {room:"Social Sciences Lecture Rooms"},
        ]
    },
]

export const undergraduateBuildingData = [
    {floor:"1st Floor",
        children:[
            {room:"AS Conference Hall"},
            {room:"College of Social Sciences Faculty Rooms"},
            {room:"Student Council Office"},
            {room:"Tug-ani Office"},
            {room:"Comfort Rooms"},
        ]
    },
]