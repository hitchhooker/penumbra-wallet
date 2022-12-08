import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountsSelector } from '../../../../accounts';
import { routesPath } from '../../../../utils';
import { Site, sites } from '../../../containers';
import { selectNewAccount } from '../../../redux';
import { Button } from '../../Button';
import { ModalWrapper } from '../../ModalWrapper';
import { SuccessCreateModalProps } from '../SuccessCreateModal';

export const ConnectedSitesModal: React.FC<SuccessCreateModalProps> = ({
  show,
  onClose,
}) => {
  const account = useAccountsSelector(selectNewAccount);
  const navigate = useNavigate();

  const [selectedSite, setSelectedSite] = useState<null | Site>(null);

  const handleRevoke = (site) => () => setSelectedSite(site);

  const handleEdit = (site) => () =>
    navigate(routesPath.SETTINGS_PERMISSIONS, {
      state: { siteName: site.name },
    });

  const handleClose = () => {
    setSelectedSite(null);
    onClose();
  };

  return (
    <ModalWrapper
      show={show}
      onClose={handleClose}
      position="center"
      className="py-[28px] px-[0px] w-[335px]"
    >
      <div className="w-[100%] flex flex-col">
        <p
          className={`border-b-[1px] border-solid border-dark_grey h1_ext pb-[16px] px-[16px] ${
            selectedSite ? '' : 'text-center'
          }`}
        >
          {selectedSite ? `Revoke ${selectedSite.name}` : 'Connected sites'}
        </p>
        <p
          className={`${
            selectedSite
              ? 'mb-[16px]'
              : 'border-b-[1px] border-solid border-dark_grey mb-[16px]'
          }  py-[24px] px-[16px] h2_ext text-center mb-[16px]`}
        >
          {selectedSite
            ? 'Are you sure you want to turn it off? You may lose access to site features.'
            : `${account.name} is connected to these sites. They can see your account
          address.`}
        </p>
        <>
          {selectedSite ? (
            <div className="w-[100%] flex px-[16px]">
              <Button
                mode="transparent"
                onClick={handleRevoke(null)}
                title="Cancel"
                className="w-[50%] mr-[4px]  ext:py-[7px] tablet:py-[7px] text_button_ext mr-[8px]"
              />
              <Button
                mode="gradient"
                onClick={() => console.log('asd')}
                title="Revoke"
                className="w-[50%] ext:py-[7px] tablet:py-[7px] text_button_ext ml-[8px]"
              />
            </div>
          ) : (
            <>
              {sites.map((i) => {
                return (
                  <div
                    className="flex items-center justify-between py-[6px] px-[16px] mt-[8px]"
                    key={i.name}
                  >
                    <div className="flex items-center">
                      <div className="w-[36px] h-[36px] li_gradient rounded-[50%] flex items-center justify-center">
                        <div className="w-[35px] h-[35px] bg-brown rounded-[50%] flex items-center justify-center"></div>
                      </div>
                      <p className="text-light_grey text_body_ext ml-[8px]">
                        {i.name}
                      </p>
                    </div>
                    <div className="flex">
                      <Button
                        mode="transparent"
                        onClick={handleRevoke(i)}
                        title="Revoke"
                        className="w-[60px] mr-[4px]  ext:py-[7px] tablet:py-[7px]  text_button_ext"
                      />
                      <Button
                        mode="gradient"
                        onClick={handleEdit(i)}
                        title="Edit"
                        className="w-[60px] ext:py-[7px] tablet:py-[7px] text_button_ext"
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </>
      </div>
    </ModalWrapper>
  );
};
