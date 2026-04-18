import { BookingItem } from "../../interface";

export default function BookingCard ({ item, imgSrc, onRemove, onEdit }: {
  item: BookingItem;
  imgSrc: string;
  onRemove?: Function;
  onEdit?: Function;
}) {
    return (
    <div className="
      group relative flex flex-col w-full max-w-[1161px] min-h-[450px] items-center justify-center 
      p-6 sm:p-10 lg:p-[50px] bg-white rounded-[15px]
      /* Standard Shadow */
      shadow-[0px_6px_12px_#00000008,0px_4px_8px_#00000005]
      /* Hover Elevation & Shadow */
      hover:shadow-[0px_30px_60px_-12px_rgba(0,0,0,0.15)]
      hover:-translate-y-2
      /* Smooth Animation */
      transition-all duration-500 ease-out
    ">
      <div className="flex flex-col w-full max-w-[1040px] h-auto items-start gap-6 lg:gap-[30px] relative rounded-lg">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-[30px] relative self-stretch w-full">
          
          {/* Image Section Container */}
          <div className="relative w-full lg:w-[691px] h-[200px] sm:h-[247px] bg-white overflow-hidden rounded-xl">
            <img
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt={item.provider}
              src={imgSrc || "https://images.unsplash.com/photo-1493238792040-d710d255c68c?auto=format&fit=crop&w=700&q=80"}
            />
            <div className="
              absolute inset-0 z-10 pointer-events-none
              shadow-[inset_0px_4px_57px_#00000045] 

              group-hover:shadow-[inset_0px_4px_100px_rgba(0,0,0,0.8)] 
              transition-shadow duration-500
            " />

            {/* Provider Name Overlay (วางไว้บนเงาอีกทีด้วย z-index) */}
            <div className="absolute z-20 top-[calc(50.00%_+_96px)] group-hover:top-[calc(50.00%_-_82px)] transition-all duration-500 left-0 w-full h-[164px] flex items-center justify-center font-semibold text-white text-4xl sm:text-5xl lg:text-7xl text-center tracking-[-1.92px] leading-tight sm:leading-[115.2px] pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,1)] px-4">
              {item.provider}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="flex flex-col items-start gap-3 lg:gap-[15px] relative flex-1 self-stretch grow w-full">
            <div className="relative flex items-center w-full h-auto lg:h-[42px] mt-[-1.00px] font-semibold text-black text-2xl sm:text-3xl lg:text-[32px] tracking-[-0.64px] leading-tight">
              {item.provider}
            </div>

            <div className="relative flex items-center w-full h-auto lg:h-[42px] font-semibold text-black text-lg sm:text-xl lg:text-2xl tracking-[-0.48px] leading-tight">
              Date Reserved: {item.bookDate}
            </div>
            
            {/* <div className="text-sm sm:text-base text-neutral-400 font-medium">
              Contact: {item.}
            </div> */}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-between relative self-stretch w-full gap-6 lg:flex-[0_0_auto]">
          <div className="flex flex-wrap w-full sm:w-auto items-center gap-4 sm:gap-6 lg:gap-12 relative">
            
            {/* Edit Button */}
            <button 
              onClick={() => onEdit?.()}
              className="all-[unset] box-border inline-flex items-center justify-center px-4 sm:px-6 py-3 relative flex-1 sm:flex-[0_0_auto] bg-black hover:bg-zinc-800 transition-colors rounded-xl cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-fit font-semibold text-white text-base lg:text-lg text-center tracking-[-0.09px] leading-[26.1px] whitespace-nowrap">
                Edit Booking →
              </div>
            </button>

            {/* Delete Button */}
            <button 
              onClick={() => onRemove?.()}
              className="all-[unset] box-border inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 relative flex-1 sm:flex-[0_0_auto] bg-black group-hover:bg-[#690909] transition-colors rounded-xl cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-fit font-semibold text-white text-base lg:text-lg text-center tracking-[-0.09px] leading-[26.1px] whitespace-nowrap">
                Delete Booking →
              </div>
            </button>
          </div>

          <div className="relative flex items-center justify-center sm:justify-end w-full sm:w-auto h-auto font-medium text-[#0000008c] text-base lg:text-lg text-center sm:text-right tracking-[-0.09px] leading-[26.1px]">
            Booked user: {item.user}
          </div>
        </div>
      </div>
    </div>
  );
};