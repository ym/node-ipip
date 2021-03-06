HEADER_SIZE      = 0x400
IP_MASK          = 0xFF000000
BLOCK_SIZE       = 8
PARTITION_FACTOR = 22
LEN_OFFSET       = 7

###*
# Driver for dat format provided by ipip.net
# @param {Buffer} buffer file content
###

Dat = (buffer) ->
  @buffer = buffer
  @len = buffer.readInt32BE(0)
  return

###*
# lookup an ip
# @param  {Integer} ip IPv4 address in int
# @return {Array}    lookup result
###

Dat::lookup = (ip) ->
  # Get leading bits of IP address
  partition = ip & IP_MASK
  # Convert to decimal number
  partition = partition >>> PARTITION_FACTOR

  floor = @buffer.readInt32LE(partition + 4) * BLOCK_SIZE + HEADER_SIZE
  ceil = @len - HEADER_SIZE - 4

  # binary search
  low = 0
  high = Math.floor((ceil - floor) / BLOCK_SIZE)
  mid = undefined

  while low <= high
    mid = low + high >>> 1
    offset = floor + mid * BLOCK_SIZE + 4
    a = @buffer.readInt32BE(offset) >>> 0
    b = @buffer.readInt32BE(offset + BLOCK_SIZE) >>> 0
    if b < ip
      low = mid + 1
    else if a > ip
      high = mid - 1
    else
      # found
      offset += BLOCK_SIZE

      index = @buffer.readInt32LE(offset + 4) >>> 0
      recordOffset = (index & 0x00FFFFFF) + @len - HEADER_SIZE
      recordLength = @buffer.readUInt8(offset + LEN_OFFSET)

      return @buffer.slice(recordOffset, recordOffset + recordLength).toString().split('\t')
  null

###*
# record columns
# @type {Array}
###

Dat::columns = [
  'country'
  'province'
  'city'
  'organization'
  'carieer'
]
module.exports = Dat
