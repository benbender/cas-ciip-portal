import React, {useRef} from 'react';
import SignaturePad from 'react-signature-canvas';
import {Button} from 'react-bootstrap';

const CertificationSignature: React.FunctionComponent = () => {
  const sigCanvas: any = useRef({});

  const uploadImage = e => {
    e.persist();
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result;
      sigCanvas.current.fromDataURL(base64);
    };
  };

  const clear = () => sigCanvas.current.clear();
  const save = () =>
    console.log(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
  return (
    <>
      <h3>Certifier Signature:</h3>
      <SignaturePad
        ref={sigCanvas}
        canvasProps={{className: 'signatureCanvas'}}
      />
      <Button onClick={save}>Save</Button>
      <Button onClick={clear}>Clear</Button>
      <input type="file" onChange={e => uploadImage(e)} />
      <style jsx global>
        {`
          .signatureCanvas {
            border: 1px solid #bbb;
            padding: 30px;
            width: 80%;
            background: #eee;
            border-radius: 6px;
            margin-bottom: 60px;
          }
        `}
      </style>
    </>
  );
};

export default CertificationSignature;
