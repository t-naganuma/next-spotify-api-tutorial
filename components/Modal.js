import { memo } from 'react';
import modalStyles from '../styles/components/Modal.module.scss';

const Modal = memo((props) => {
  const { flag, closeModal } = props;
  console.log('レンダリングしました！')
  if (!flag) return <></>;

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <div className={`${modalStyles.modal} ${modalStyles.is_show}`}>
      <div className={modalStyles.body}>
        <p className={modalStyles.text}>プレイリストを作成しました！</p>
        <div className={modalStyles.button_area}>
          <button
            type="button"
            onClick={handleCloseModal}
            className={modalStyles.close}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
});

export default Modal;