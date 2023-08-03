type Props = {
  text: string
}
const Marquee = ({ text }: Props) => (
  <div className="marquee h-4 overflow-hidden whitespace-nowrap text-white">
    <p className="w-full h-full translate-x-full leading-[1rem]">{text}</p>;
  </div>
)

export default Marquee
