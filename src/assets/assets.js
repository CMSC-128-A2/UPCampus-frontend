import {
    Notebook,
    MapPinned,
    LogOut,
    Menu,
    Trash2,
    ChevronDown,
    Plus,
    Minus,
    X,
    ClockArrowDown,
    GraduationCap,
    UserCog,
    Building,
    Expand,
    MapPin,
    Goal,
    ArrowRightToLine,
    ArrowLeftToLine,
    Utensils,
    BookOpen,
    House,
    Cross,
    Tent,
    ShieldUser,
    Car,
    Icon,
    Volleyball,
    Star,
    Bike,
} from 'lucide-react';

import { basketball, soccerBall } from '@lucide/lab';
{
    /* <Icon iconNode={basketball} /> */
}

export const buildingsData = [
    { name: 'Administration Building', index: '1', icon: <Building /> },
    { name: 'Science Building', index: '2', icon: <Building /> },
    {
        name: 'Technology Innovation Center Bldg.',
        index: '3',
        icon: <Building />,
        children: [
            { name: 'Cafeteria', index: '3a', icon: <Utensils /> },
            { name: 'Clinic', index: '3b', icon: <Cross /> },
        ],
    },
    { name: 'Library Building', index: '4', icon: <BookOpen /> },
    {
        name: 'Residence Halls',
        index: '5',
        icon: <House />,
        children: [
            { name: 'Balay Varangao', index: '5a', icon: <House /> },
            { name: 'Lalahon Hall', index: '5b', icon: <House /> },
            { name: 'Liadlaw Hall', index: '5c', icon: <House /> },
            { name: 'Lihangin Hall', index: '5d', icon: <House /> },
        ],
    },
    {
        name: 'School of Management',
        index: '6',
        icon: <Building />,
        children: [
            {
                name: 'Management Administration',
                index: '6a',
                icon: <Building />,
            },
            { name: 'Management Bldg. 1', index: '6b', icon: <Building /> },
            { name: 'Management Bldg. 2', index: '6c', icon: <Building /> },
        ],
    },
    { name: 'Undergraduate Building', index: '7', icon: <Building /> },
    { name: 'Arts and Design Workshop Bldg.', index: '8', icon: <Building /> },
    {
        name: 'Arts and Design Workshop Bldg. 2',
        index: '9',
        icon: <Building />,
    },
    {
        name: 'Arts and Science Extension Bldg. (ASX)',
        index: '10',
        icon: <Building />,
    },
    {
        name: 'Arts and Sciences (AS) Bldg.',
        index: '11',
        icon: <Building />,
        children: [
            { name: 'AS Conference Hall', index: '11a', icon: <Building /> },
            { name: 'AS East Wing', index: '11b', icon: <Building /> },
            { name: 'AS West Wing', index: '11c', icon: <Building /> },
        ],
    },
    { name: 'Union Building', index: '12', icon: <Building /> },
    { name: 'Cebu Cultural Center', index: '13', icon: <Building /> },
    { name: 'High School Area', index: '14', icon: <Building /> },
];

export const activityAreaData = [
    { name: 'Oblation Square', index: 'A1', icon: <Building /> },
    { name: 'Admin Cottages', index: 'A2', icon: <Tent /> },
    { name: 'Malacañang Cottage', index: 'A3', icon: <Tent /> },
    { name: 'Admin Field', index: 'A4', icon: <Goal /> },
    { name: 'College Mini Stage', index: 'A5', icon: <Star /> },
    { name: 'Undergraduate Cottages', index: 'A6', icon: <Tent /> },
    {
        name: 'SOM Basketball Court',
        index: 'A7',
        icon: <Icon iconNode={basketball} />,
    },
    { name: 'Volleyball Court', index: 'A8', icon: <Volleyball /> },
    { name: 'Amphitheater/Sunset Garden', index: 'A9', icon: <Star /> },
    { name: 'High School Open Field', index: 'A10', icon: <Goal /> },
    { name: 'High School Open Court', index: 'A11', icon: <Star /> },
    { name: 'High School Covered Court', index: 'A12', icon: <Star /> },
    {
        name: 'Soccer Field',
        index: 'A13',
        icon: <Icon iconNode={soccerBall} />,
    },
];

export const securityAndParkingData = [
    { name: 'Entrance Gate Guard House', index: 'G1', icon: <ShieldUser /> },
    { name: 'Exit Gate Guard House', index: 'G2', icon: <ShieldUser /> },
    { name: 'High School Guard House', index: 'G3', icon: <ShieldUser /> },
    { name: 'AS Guard House', index: 'G4', icon: <ShieldUser /> },
    { name: 'COS Bldg. Parking', index: 'P1', icon: <Car /> },
    { name: 'Canteen Parking', index: 'P2', icon: <Car /> },
    { name: 'Library Parking', index: 'P3', icon: <Car /> },
    { name: 'Motorcycle Parking', index: 'P4', icon: <Bike /> },
    { name: 'Undergraduate Bldg. Parking', index: 'P5', icon: <Car /> },
    { name: 'AS Motorcycle Parking', index: 'P6', icon: <Bike /> },
    { name: 'AS Parking', index: 'P7', icon: <Car /> },
];

export const libraryBuildingData = [
    {
        floor: '1st Floor',
        children: [{ room: 'Learning Commons' }, { room: 'Comfort Rooms' }],
    },
    {
        floor: '2nd Floor',
        children: [
            { room: 'Audio Visual Room (AVR 1)' },
            { room: 'Performing Arts Hall (PAH)' },
        ],
    },
];

export const cosBldgData = [
    {
        floor: '1st Floor',
        children: [
            { room: 'Office of the University Registrar' },
            { room: 'Cashier Office' },
            { room: 'College of Science Dean Office' },
            { room: 'College of Science Secretary Office' },
            { room: 'Bids and Awards Committee Office' },
            { room: 'Comfort Rooms' },
        ],
    },
    {
        floor: 'Mezzanine Floor',
        children: [
            { room: 'Legal Office' },
            { room: 'Resident Psychologist Office' },
            { room: 'Faculty Lounge' },
            { room: 'Human Resources and Development Office' },
            { room: 'Stock Room' },
        ],
    },
    {
        floor: '2nd Floor',
        children: [
            { room: 'Math and Statistics Office' },
            { room: 'Math-Stat Laboratory Rooms' },
            { room: 'Comfort Rooms' },
        ],
    },
    {
        floor: '3rd Floor',
        children: [
            { room: 'Department of Computer Science (DCS) Faculty Room' },
            { room: 'DCS Laboratory Rooms' },
            { room: 'DCS Mini Library' },
            { room: 'DCS Mini Conference Room' },
            { room: 'Comfort Rooms' },
        ],
    },
    {
        floor: '4th Floor',
        children: [
            { room: 'DCS Lecture Rooms' },
            { room: 'DCS Teaching Labs' },
            { room: 'Comfort Rooms' },
        ],
    },
    {
        floor: '5th Floor',
        children: [
            { room: 'Biology Faculty Room' },
            { room: 'Biology Lecture Rooms' },
            { room: 'Comfort Rooms' },
        ],
    },
    {
        floor: '6th Floor',
        children: [
            { room: 'Histology Laboratory' },
            { room: 'Botany Laboratory ' },
            { room: 'Zoology Laboratory ' },
            { room: 'Molecular Biology and Genetics Laboratory ' },
            { room: 'Comfort Rooms' },
        ],
    },
];

export const administrationBuildingData = [
    {
        floor: '1st Floor',
        children: [
            { room: 'Office of the Chancellor' },
            { room: 'Myths Cafe' },
            { room: 'Mindscapes' },
            { room: 'Office of the Vice Chancellor for Academic Affairs' },
            { room: 'Office of the Vice Chancellor for Administration' },
            { room: 'Comfort Rooms' },
        ],
    },
    {
        floor: '2nd Floor',
        children: [
            { room: 'Office of the Student Affairs' },
            { room: 'ILC - Audio Visual Room' },
            { room: 'Boardroom' },
            { room: 'Office of the Campus Architect' },
            { room: 'Office for Initiatives in Culture and the Arts' },
            { room: 'Staff Lounge' },
        ],
    },
];

export const artsAndSciencesBuildingData = [
    {
        floor: '1st Floor',
        children: [
            { room: 'AS Conference Hall' },
            { room: 'College of Social Sciences Faculty Rooms' },
            { room: 'Student Council Office' },
            { room: 'Tug-ani Office' },
            { room: 'Comfort Rooms' },
        ],
    },
    {
        floor: '2nd Floor',
        children: [
            { room: 'NSTP Faculty Office' },
            { room: 'Mathematics Lecture Rooms' },
            { room: 'Information Technology Center Office' },
            { room: 'Social Sciences Lecture Rooms' },
        ],
    },
];

export const undergraduateBuildingData = [
    {
        floor: '1st Floor',
        children: [
            { room: 'AS Conference Hall' },
            { room: 'College of Social Sciences Faculty Rooms' },
            { room: 'Student Council Office' },
            { room: 'Tug-ani Office' },
            { room: 'Comfort Rooms' },
        ],
    },
];
