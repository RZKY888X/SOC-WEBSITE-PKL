//Card.tsx
interface CardProps {
  title: string;
  icon: string;
  value: number;
}

export default function Card({ title, icon, value }: CardProps) {
  return (
    <div className='bg-gradient-to-br from-[#1B263B] to-[#0F1419] p-6 rounded-2xl text-center shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-sm'>
      <div className='text-4xl mb-3 filter drop-shadow-lg'>{icon}</div>
      <p className='mt-2 font-semibold text-gray-200 text-sm uppercase tracking-wide'>{title}</p>
      <p className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-1'>{value}</p>
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300'></div>
    </div>
  );
}
