import { IncomingForm } from 'formidable';

export async function getData(formData) {
  const data = await new Promise(function (resolve, reject) {

    const form = new IncomingForm({ keepExtensions: true });

    form.parse(formData, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });

  });

  console.log(data);
  
  return data;
}
