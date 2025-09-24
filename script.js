async function editImage() {
  const fileInput = document.getElementById("imageInput");
  const prompt = document.getElementById("prompt").value;
  const resultDiv = document.getElementById("result");

  if (fileInput.files.length === 0 || !prompt) {
    alert("⚠️ لازم ترفع صورة وتكتب الوصف الأول!");
    return;
  }

  // رفع الصورة وتحويلها Base64
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    const base64Image = reader.result.split(",")[1];

    try {
      // إرسال الطلب لـ API
      let res = await fetch("https://a1d.ai/api/nano-banana/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          images: [base64Image],
          enable_base64_output: false
        })
      });

      res = await res.json();
      const taskId = res.data.id;
      resultDiv.innerHTML = "⏳ جاري المعالجة...";

      // متابعة العملية
      let output = null;
      for (let i = 0; i < 20; i++) {
        let status = await fetch(`https://a1d.ai/api/nano-banana/status?id=${taskId}`);
        status = await status.json();
        
        if (status.data.outputs && status.data.outputs.length > 0) {
          output = status.data.outputs[0];
          break;
        }
        await new Promise(r => setTimeout(r, 5000));
      }

      if (output) {
        resultDiv.innerHTML = `<img src="${output}" alt="نتيجة التعديل">`;
      } else {
        resultDiv.innerHTML = "⚠️ لم يتم إخراج صورة.";
      }

    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = "❌ حصل خطأ أثناء المعالجة.";
    }
  };
    }
            
