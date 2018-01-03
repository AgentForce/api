#Tạo mới campaign FA
    không cần ngày kết thúc. Chỉ cần ngày bắt đầu
    lấy móc 15 days làm móc 0
    nếu ngày 16 thì 0+1
    ngày 14 thì 0 (edited)
    tức 14/11 thì tính tháng 11
    còn 16/11 thì tính tháng 12
    nếu set ngày bắt đầu là 14/11 hay 15/11  thì: period =11, start date = 14/11, end date = cách tính lich của lịch tây
    nếu set ngày bắt đầu là 16/11 thì : period = 12, start date = 16/11 và end date = cách tính lịch của lịch tây
##res: 
    moment + từng tháng, không quan tâm ngày

#4. Tạo lead + activity
    thông tin input theo tạo lead
    + type là khách hàng tiềm năng hay hẹn gặp, hợp đồng, …
    trong đây api em mới xử lý chưa có lead thì tạo
    có rồi thì thôi
    chú ý nhỏ là tạo lead với type là khách hàng tiềm năng
    còn lead chưa có mà type là ký hợp đồng thì báo fail đi
    còn chỗ app ( thằng app gọi api nó sẽ tùy layout mà lấy thông tin ví dụ ở layout khách hàng tiềm năng thì thông tin lead là do thằng user điền vào
    còn ở layout còn lại
    nó đã có thông tin sẵn rồi
    detail lead nó gọi em trước đó


#7. Tạo event
#8. Tạo invite

#9. update event
