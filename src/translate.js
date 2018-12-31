const trans = ( str, language_code ) => {
	if(!language_code)
		language_code = 'zh-HK'
	switch( str ){
		case 'Show':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '展示'
				case 'zh-TW':
					return '展示'
				case 'id':
					return 'Tampilkan'
				default:
					return str
			}
		case 'Status':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '狀態'
				case 'zh-TW':
					return '狀態'
				case 'id':
					return 'Status'
				default:
					return str
			}			
		case 'All':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '所有'
				case 'zh-TW':
					return '所有'
				case 'id':
					return 'Semua'
				default:
					return str
			}
		case 'Name':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '名稱'
				case 'zh-TW':
					return '名稱'
				case 'id':
					return 'Nama'
				default:
					return str
			}
		case 'Description':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '描述'
				case 'zh-TW':
					return '描述'
				case 'id':
					return 'Deskripsi'
				default:
					return str
			}
		case 'Channel':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '渠道'
				case 'zh-TW':
					return '渠道'
				case 'id':
					return 'Saluran'
				default:
					return str
			}
		case 'Room type':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '房型'
				case 'zh-TW':
					return '房型'
				case 'id':
					return 'Tipe kamar'
				default:
					return str
			}
		case 'Rate plan':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '售价计划'
				case 'zh-TW':
					return '售价计划'
				case 'id':
					return 'Rate plan'
				default:
					return str
			}
		case 'Promotions':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '促銷'
				case 'zh-TW':
					return '促銷'
				case 'id':
					return 'Promosi'
				default:
					return str
			}
		case 'Create promotion':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '新增促銷'	
				case 'zh-TW':
					return '新增促銷'
				case 'id':
					return 'Buat promosi'
				default:
					return str
			}						
		case 'promotion':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '促銷'
				case 'zh-TW':
					return '促銷'
				case 'id':
					return 'promosi'
				default:
					return str
			}								
		case 'Add ':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '新增'
				case 'zh-TW':
					return '新增'
				case 'id':
					return 'Tambahkan '
				default:
					return str
			}								
		case 'Edit ':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '編輯'
				case 'zh-TW':
					return '編輯'
				case 'id':
					return 'Edit '
				default:
					return str
			}												
		case 'Promotion name':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '促銷名稱'	
				case 'zh-TW':
					return '促銷名稱'
				case 'id':
					return 'Nama promosi'
				default:
					return str
			}																					
		case 'Applicable on channel':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '適用於渠道'
				case 'zh-TW':
					return '適用於渠道'
				case 'id':
					return 'Berlaku di saluran'
				default:
					return str
			}
		case 'Select all':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '全選'
				case 'zh-TW':
					return '全選'
				case 'id':
					return 'Pilih Semua'
				default:
					return str
			}									
		case 'Select all except those channels that we allow a hotel to add a manual booking to':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '全選除了允許人工添加訂單的渠道'
				case 'zh-TW':
					return '全選除了允許人工添加訂單的渠道'
				case 'id':
					return 'Pilih semua kecuali saluran yang kami izinkan sebuah hotel untuk menambahkan pemesanan manual'
				default:
					return str
			}									
		case 'Deselect all':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '全部取消'	
				case 'zh-TW':
					return '全部取消'
				case 'id':
					return 'Hapus semua'
				default:
					return str
			}						
		case 'Assume applied to new channels':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '默認適用於新加渠道'	
				case 'zh-TW':
					return '默認適用於新加渠道'
				case 'id':
					return 'Asumsikan diterapkan ke saluran baru'
				default:
					return str
			}								
		case 'Assume applied to new room types':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '默認適用於新加房型'
				case 'zh-TW':
					return '默認適用於新加房型'
				case 'id':
					return 'Asumsikan diterapkan ke tipe kamar baru'
				default:
					return str
			}
		case 'Assume applied to new rate plans':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '默認適用於新加售价计划'
				case 'zh-TW':
					return '默認適用於新加售价计划'
				case 'id':
					return 'Asumsikan diterapkan ke rate plan baru'
				default:
					return str
			}						
		case 'Book date':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '預訂日期'
				case 'zh-TW':
					return '預訂日期'
				case 'id':
					return 'Tanggal buku'
				default:
					return str
			}									
		case 'Check-in date':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '入住日期'
				case 'zh-TW':
					return '入住日期'
				case 'id':
					return 'Tanggal check-in'
				default:
					return str
			}								
		case 'Minimum stay days':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '最低天數'
				case 'zh-TW':
					return '最低天數'
				case 'id':
					return 'Tinggal minimum hari'
				default:
					return str
			}							
		case 'Minimum booked rooms':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '最低訂房數量'
				case 'zh-TW':
					return '最低訂房數量'
				case 'id':
					return 'Kamar yang dipesan minimal'
				default:
					return str
			}
		case 'Minimum days':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '最低天数'	
				case 'zh-TW':
					return '最低天数'
				case 'id':
					return 'Minimum hari'
				default:
					return str
			}					
		case 'Number of discounted days':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '打折天數'
				case 'zh-TW':
					return '打折天數'
				case 'id':
					return 'Jumlah hari diskon'
				default:
					return str
			}
		case 'Other options':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '其他選項'
				case 'zh-TW':
					return '其他選項'
				case 'id':
					return 'Pilihan lain'
				default:
					return str
			}					
		case 'Booking window (days)':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '預定窗口 （天）'
				case 'zh-TW':
					return '預定窗口 （天）'
				case 'id':
					return 'Jendela pemesanan (hari)'
				default:
					return str
			}					
		case 'Less or equal to':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '少於等於'	
				case 'zh-TW':
					return '少於等於'
				case 'id':
					return 'Kurang atau sama dengan'
				default:
					return str
			}						
		case 'More than':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '多於'
				case 'zh-TW':
					return '多於'
				case 'id':
					return 'Lebih dari'
				default:
					return str
			}										
		case 'Basis':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '基於'
				case 'zh-TW':
					return '基於'
				case 'id':
					return 'Berdasarkan'
				default:
					return str
			}										
		case 'Percentage based':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '比率'
				case 'zh-TW':
					return '比率'
				case 'id':
					return 'Berdasarkan persentase'
				default:
					return str
			}										
		case 'Room based':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '房間數量'
				case 'zh-TW':
					return '房間數量'
				case 'id':
					return 'Ruangan berdasarkan'
				default:
					return str
			}										
		case 'Discount off BAR':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '相对最佳房價（BAR）折扣'
				case 'zh-TW':
					return '相对最佳房價（BAR）折扣'
				case 'id':
					return 'Diskon BAR'
				default:
					return str
			}					
		case 'Discount':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '折扣'
				case 'zh-TW':
					return '折扣'
				case 'id':
					return 'Diskon'
				default:
					return str
			}		
		case 'Specific point of origin':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '僅限特定國家'
				case 'zh-TW':
					return '僅限特定國家'
				case 'id':
					return 'Titik asal spesifik'
				default:
					return str
			}									
		case 'Mobile only':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '僅限移動端'
				case 'zh-TW':
					return '僅限移動端'
				case 'id':
					return 'Khusus seluler'
				default:
					return str
			}										
		case 'Members only':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '僅限會員'
				case 'zh-TW':
					return '僅限會員'
				case 'id':
					return 'Hanya anggota'
				default:
					return str
			}										
		case 'Promotional rate is stackable':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '折扣率可以和其他折扣疊加'
				case 'zh-TW':
					return '折扣率可以和其他折扣疊加'
				case 'id':
					return 'Tingkat promosi dapat ditumpuk'
				default:
					return str
			}						
		case 'Required fields':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '必填欄目'
				case 'zh-TW':
					return '必填欄目'
				case 'id':
					return 'Bidang wajib diisi'
				default:
					return str
			}									
		case 'Cancel':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '取消'
				case 'zh-TW':
					return '取消'
				case 'id':
					return 'Membatalkan'
				default:
					return str
			}										
		case 'Save':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '保存'
				case 'zh-TW':
					return '保存'
				case 'id':
					return 'Menyimpan'
				default:
					return str
			}														
		case 'Your update was successful':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '編輯促銷成功'
				case 'zh-TW':
					return '編輯促銷成功'
				case 'id':
					return 'Pembaruan Anda berhasil'
				default:
					return str
			}										
		case 'Your promotion was created successfully':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '新增促銷成功'
				case 'zh-TW':
					return '新增促銷成功'
				case 'id':
					return 'Promosi Anda berhasil dibuat'
				default:
					return str
			}									
		case 'Your session has expired':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '你的連接已經過期'
				case 'zh-TW':
					return '你的連接已經過期'
				case 'id':
					return 'Sesi Anda telah berakhir'
				default:
					return str
			}						
		case 'Select or type...':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '選擇或輸入'
				case 'zh-TW':
					return '選擇或輸入'
				case 'id':
					return 'Pilih atau ketik...'
				default:
					return str
			}
		case 'Select a date range':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '選擇一個時間段'
				case 'zh-TW':
					return '選擇一個時間段'
				case 'id':
					return 'Pilih rentang tanggal'
				default:
					return str
			}
		case 'Add another':
			switch(language_code){
				case 'en':
					return str
				case 'zh-HK':
					return '增加一個時間段'
				case 'zh-TW':
					return '增加一個時間段'
				case 'id':
					return 'Tambahkan rentang tanggal lain'
				default:
					return str
			}				
		default:
			console.log('Translation Error:' + str)
			switch(language_code){
				case 'en':
					return 'ERROR'
				case 'zh-HK':
					return '錯誤'
				case 'zh-TW':
					return '錯誤'
				case 'id':
					return 'KESALAHAN'
				default:
					return 'ERROR'
			}
	}
}

export default trans