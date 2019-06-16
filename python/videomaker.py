import os
import shutil
from PIL import Image
import subprocess
import datetime

FRAME_FOLDER = "../web/uploads"
CACHE_FOLDER = "../cache/"
RESOLUTION = [ 1920, 1080 ]

# creating a tmp folder structure to store termporary files
unique = str(datetime.datetime.now().timestamp()).replace( '.', '' )
tmp_folder = os.path.join( CACHE_FOLDER, unique + '/' )
if os.path.exists( tmp_folder ):
	print( "Removing " + tmp_folder )
	shutil.rmtree( tmp_folder )
os.makedirs(tmp_folder)

def new_packed_frame():
	return {'subs': [],'objects': [],'authors': [] }

def frame_name( i ):
	out = str(i)
	while len(out) < 6:
		out = '0' + out
	return out + '.png'
		
def generate_frame_cache( i ):
	
	fname = os.path.join( tmp_folder, frame_name( i ) )
	
	pf = packed_frames[i]
	if len( pf[ 'subs' ] ) == 0:
		img = Image.new('RGBA', (RESOLUTION[0],RESOLUTION[1]), (0,0,0,255))
		img.save( fname, "PNG" )
	
	if len( pf[ 'subs' ] ) == 1:
		shutil.copyfile( os.path.join( CACHE_FOLDER, pf[ 'subs' ][0] ), fname )
		return
	
	img = Image.new('RGBA', (RESOLUTION[0],RESOLUTION[1]), (0,0,0,255))
	
	for p in pf[ 'subs' ]:
		fp = os.path.join( FRAME_FOLDER, p )
		layer = Image.open( fp )
		lw, lh = layer.size
		if lw != RESOLUTION[0] or lh != RESOLUTION[1]:
			layer = layer.resize( RESOLUTION, Image.NEAREST)
		img = Image.alpha_composite(img, layer)
	
	img.save( fname, "PNG" )
	print( 'frame ' + fname + ' saved' )
	
	return True

raw_frames = []
for f in os.listdir( FRAME_FOLDER ):
	if f[-4:] != '.png':
		continue
	raw_frames.append( f )
raw_frames.sort()

last_frame = 0
packed_frames = {}

for p in raw_frames:
	
	data = p.split( '.' )
	
	fnum = int(data[0])
	ts = int(data[1])
	obj = data[2]
	author = data[3]
	
	if not fnum in packed_frames:
		packed_frames[ fnum ] = new_packed_frame()
		if last_frame < fnum:
			last_frame = fnum
	packed_frames[ fnum ][ 'subs' ].append( p )
	if not obj in packed_frames[ fnum ][ 'objects' ]:
		packed_frames[ fnum ][ 'objects' ].append( obj )
	if not author in packed_frames[ fnum ][ 'authors' ]:
		packed_frames[ fnum ][ 'authors' ].append( author )

cache_successfull = True
		
for i in range( last_frame ):
	if not i in packed_frames:
		packed_frames[ fnum ] = new_packed_frame()
	packed_frames[ fnum ][ 'subs' ].sort()
	packed_frames[ fnum ][ 'objects' ].sort()
	packed_frames[ fnum ][ 'authors' ].sort()
	# everything is in order, let's generate the cache
	cache_successfull = generate_frame_cache( i )
	if not cache_successfull:
		print( "Cache generation crashed at frame " + str(i) + "!" )
		break

# and, last but not least, let's compress a video!!!!
if cache_successfull:
	video_path = os.path.abspath( os.path.join( tmp_folder, unique + '.mp4' ) )
	tmp_folder = os.path.abspath( tmp_folder )
	cmd = 'ffmpeg -f image2 -framerate 25 -r 25 -i ' + tmp_folder + '/%6d.png -an -q:v 1 -threads 3 ' + video_path
	subprocess.call( cmd.split( ' ' ) )











