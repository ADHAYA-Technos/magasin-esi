import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const VerificationModal = ({ open, handleClose, email }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style} className='flex flex-col items-center rounded-xl p-6'>
        <p className='font-bold text-Primary text-[24px]'>
          Vérifier votre adresse e-mail
        </p>
        <p className='font-medium text-[#515459] text-[14px] mt-2'>
          Un lien de vérification a été envoyé à votre email
        </p>
        <p className='font-medium text-[#515459] text-[14px] mt-1'>"{email}"</p>

        <button
          onClick={handleClose}
          className='font-semibold text-white text-[14px] bg-Primary rounded-lg py-2 px-4 mt-6'
        >
          D'accord!
        </button>
      </Box>
    </Modal>
  );
};

export default VerificationModal;
