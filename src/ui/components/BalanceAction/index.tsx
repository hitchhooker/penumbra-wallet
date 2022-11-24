import { useMediaQuery } from '../../../hooks';
import { Balance } from '../Balance';
import { Button } from '../Button';
import { ArrowUpRightSvg, CachedSvg, DowmloadSvg } from '../Svg';

export const BalanceAction = () => {
  const isDesktop = useMediaQuery();
  return (
    <div className="w-[100%] flex flex-col items-center">
      <div className="ext:w-[40px] ext:h-[40px] tablet:w-[51px] tablet:h-[51px] li_gradient rounded-[50%] flex  items-center justify-center">
        <div className="ext:w-[39px] ext:h-[39px] tablet:w-[50px] tablet:h-[50px] bg-brown rounded-[50%] flex items-center justify-center">
          PNB
        </div>
      </div>
      <Balance className="pt-[16px] pb-[24px] text_numbers" />
      <div className="flex tablet:gap-x-[69px]  tablet:gap-x-[69px] ext:mb-[24px] tablet:mb-[40px]">
        <div className="flex flex-col items-center">
          <Button
            mode="gradient"
            onClick={() => console.log('asd')}
            title={
              <div className="flex items-center justify-center">
                <DowmloadSvg />
              </div>
            }
            className="rounded-[50%] w-[51px] ext:py-[14px] tablet:py-[14px]"
          />
          <p className="text_button pt-[8px]">Receive</p>
        </div>
        <div className="flex flex-col items-center">
          <Button
            mode="gradient"
            onClick={() => console.log('asd')}
            title={
              <div className="flex items-center justify-center">
                <ArrowUpRightSvg />
              </div>
            }
            className="rounded-[50%] w-[51px] ext:py-[14px] tablet:py-[14px]"
          />
          <p className="text_button pt-[8px]">Send</p>
        </div>
        <div className="flex flex-col items-center">
          <Button
            mode="gradient"
            onClick={() => console.log('asd')}
            title={
              <div className="flex items-center justify-center">
                <CachedSvg />
              </div>
            }
            className="rounded-[50%] w-[51px] ext:py-[14px] tablet:py-[14px]"
          />
          <p className="text_button pt-[8px]">Exchange</p>
        </div>
      </div>
      <div className="w-[100%] flex items-center justify-between ext:py-[15.5px] tablet:py-[13.5px] px-[18px] border-y-[1px] border-solid border-dark_grey">
        <div className="flex flex-col">
          <p className="text_button mb-[4px]">Stake</p>
          <p
            className={`${
              isDesktop ? 'text_body' : 'text_ext'
            } text-light_grey`}
          >
            Earn to 21% per year
          </p>
        </div>
        <Button
          mode="gradient"
          onClick={() => console.log('asd')}
          title="Stake"
          className="w-[119px]"
        />
      </div>
    </div>
  );
};
