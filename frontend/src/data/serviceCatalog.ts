export type HomeService = {
  name: string
  value: string
  image: string
  alt: string
  description: string
  rate: string
  providers: string[]
  offeredServices: string[]
}

export const featuredServices: HomeService[] = [
  {
    name: 'Cleaning Services',
    value: 'cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=720&h=420&q=82',
    alt: 'Professional cleaner caring for a home',
    description: 'Home cleaning tailored to your space and schedule.',
    rate: '₹299',
    providers: ['Sparkle Cleaners', 'FreshNest Home Care', 'Neat & Tidy Co.'],
    offeredServices: ['Deep Cleaning', 'Regular Cleaning', 'Move-in/Move-out Cleaning'],
  },
  {
    name: 'Electricians',
    value: 'electricians',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=720&h=420&q=82',
    alt: 'Electrician working on a home electrical panel',
    description: 'Safe electrical repairs, installations, and checks.',
    rate: '₹249',
    providers: ['BrightWire Electric', 'SafeSpark Services', 'VoltCare Technicians'],
    offeredServices: ['Electrical Repairs', 'Fixture Installation', 'Safety Inspections'],
  },
  {
    name: 'Plumbers',
    value: 'plumbers',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=720&h=420&q=82',
    alt: 'Plumber repairing a pipe',
    description: 'Reliable help with leaks, fittings, and repairs.',
    rate: '₹199',
    providers: ['FlowFix Plumbing', 'PipeWise Home Services', 'ClearFlow Pros'],
    offeredServices: ['Leak Repairs', 'Tap & Fixture Repair', 'Drain Cleaning'],
  },
  {
    name: 'Painters',
    value: 'painters',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=720&h=420&q=82',
    alt: 'Painter working on a home interior',
    description: 'Refresh your home with careful interior painting.',
    rate: '₹349',
    providers: ['ColorNest Painters', 'FreshCoat Home Studio', 'TrueTone Painting'],
    offeredServices: ['Interior Painting', 'Wall Touch-ups', 'Color Consultation'],
  },
  {
    name: 'Carpentry',
    value: 'carpentry',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=720&h=420&q=82',
    alt: 'Carpentry tools ready for a repair',
    description: 'Furniture assembly and everyday woodwork repairs.',
    rate: '₹249',
    providers: ['Oak & Nail Carpentry', 'HandyCraft Woodworks', 'HomeFit Carpenters'],
    offeredServices: ['Furniture Assembly', 'Door & Cabinet Repairs', 'Custom Shelving'],
  },
  {
    name: 'Appliance Repair',
    value: 'appliance-repair',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=720&h=420&q=82',
    alt: 'Home appliance ready for repair',
    description: 'Help diagnosing and repairing home appliances.',
    rate: '₹299',
    providers: ['FixRight Appliances', 'HomeTech Repair', 'QuickFix Appliance Care'],
    offeredServices: ['Washer & Dryer Repair', 'Refrigerator Repair', 'Appliance Installation'],
  },
]

export const additionalServices: HomeService[] = [
  {
    name: 'Pest Control',
    value: 'pest-control',
    image: 'https://images.unsplash.com/photo-1621905252472-943afaa20e20?auto=format&fit=crop&w=720&h=920&q=82',
    alt: 'Professional providing home maintenance services',
    description: 'Indoor and outdoor pest treatment for your home.',
    rate: '₹189',
    providers: ['PestShield Experts', 'SafeHome Pest Care', 'GreenGuard Solutions'],
    offeredServices: ['General Pest Treatment', 'Rodent Control', 'Preventive Home Treatment'],
  },
  {
    name: 'Roofing & Gutters',
    value: 'roofing-gutters',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=720&h=920&q=82',
    alt: 'Modern home exterior and roof',
    description: 'Roof inspections, gutter repairs, and seasonal cleaning.',
    rate: '₹549',
    providers: ['PeakRoof & Gutters', 'RoofCare Home Pros', 'RainFlow Roofing'],
    offeredServices: ['Roof Inspection', 'Gutter Cleaning', 'Roof & Gutter Repairs'],
  },
  {
    name: 'Gardening & Landscaping',
    value: 'gardening-landscaping',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=720&h=920&q=82',
    alt: 'Gardener caring for plants',
    description: 'Garden maintenance, planting, and landscape care.',
    rate: '₹349',
    providers: ['GreenLeaf Landscapes', 'GardenGlow Services', 'Root & Bloom Co.'],
    offeredServices: ['Garden Maintenance', 'Planting & Pruning', 'Landscape Design'],
  },
  {
    name: 'Heating & AC',
    value: 'heating-ac',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=720&h=920&q=82',
    alt: 'Technician servicing home equipment',
    description: 'Routine maintenance and home climate repairs.',
    rate: '₹449',
    providers: ['CoolBreeze HVAC', 'ComfortFlow Home Care', 'ClimateWise Technicians'],
    offeredServices: ['AC Servicing', 'Heating Repairs', 'Climate System Inspection'],
  },
  {
    name: 'Window Cleaning',
    value: 'window-cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=720&h=920&q=82',
    alt: 'Professional cleaning a home',
    description: 'Interior and exterior window cleaning for your home.',
    rate: '₹199',
    providers: ['ClearView Window Care', 'BrightPane Cleaners', 'CrystalClear Services'],
    offeredServices: ['Interior Window Cleaning', 'Exterior Window Cleaning', 'Glass & Screen Cleaning'],
  },
  {
    name: 'Handyman Services',
    value: 'handyman',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=720&h=920&q=82',
    alt: 'Tools for home repair and assembly',
    description: 'General home repairs, assembly, and installations.',
    rate: '₹249',
    providers: ['Homewise Handyman', 'FixIt Home Services', 'AllRound Home Pros'],
    offeredServices: ['General Home Repairs', 'Furniture Assembly', 'Home Installations'],
  },
]

export const allHomeServices = [...featuredServices, ...additionalServices]
