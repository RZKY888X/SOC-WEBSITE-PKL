interface CardProps {
  title: string;
  icon: string;
  value: number;
}

export default function Card({ title, icon, value }: CardProps) {
  return (
    <div className='bg-[#1B263B] p-4 rounded text-center'>
      <div className='text-3xl'>{icon}</div>
      <p className='mt-1 font-semibold'>{title}</p>
      <p className='text-xl font-bold'>{value}</p>
    </div>
  );
}
